const traceMapper = (row, colPropertiesIndex) => {
  if (!hasRequiredProperties(['timestamp', 'message'], row, colPropertiesIndex)) {
    return null;
  }
  const model = { };
  model.timestamp = new Date(row[colPropertiesIndex['timestamp']]);
  model.severityLevel = row[colPropertiesIndex['severityLevel']] || 0;
  model.message = row[colPropertiesIndex['message']];
  
  return model;
};

const exceptionMapper = (row, colPropertiesIndex) => {
  if (!hasRequiredProperties(['timestamp'], row, colPropertiesIndex)) {
    return null;
  }
  const model = { };
  model.timestamp = new Date(row[colPropertiesIndex['timestamp']]);
  model.severityLevel = row[colPropertiesIndex['severityLevel']] || 0;
  model.message = 
  [
    row[colPropertiesIndex['problemId']],
    row[colPropertiesIndex['outerMessage']]
  ]
  .filter(v => v != null)
  .join(': ');
  
  if (row[colPropertiesIndex['outerMessage']] !== row[colPropertiesIndex['innermostMessage']] && row[colPropertiesIndex['innermostMessage']]) {
    model.message += '\r\n' +
    [
      row[colPropertiesIndex['innermostType']],
      row[colPropertiesIndex['innermostMessage']]
    ]
    .filter(v => v != null)
    .join(': ');
  }
  return model;
};

const responseMappers = {
  'trace': traceMapper,
  'exception': exceptionMapper,
  'log': traceMapper
};

export function getRowMapper(row, colPropertiesIndex) {
  const itemType = row[colPropertiesIndex['itemType']];
  if (responseMappers[itemType]) {
    return responseMappers[itemType];
  }
  if (hasRequiredProperties(['timestamp', 'message'], row, colPropertiesIndex)) {
    return responseMappers['log'];
  }
  return null;
}

/**
 * return a dictionary of property name and column index
 * {[columnName: string]: columnIndex: number} response
 */
export function buildColumnPropertyIndex(response) {
  const colPropertiesIndex = {};
  response.tables[0].columns.forEach((c, i) => colPropertiesIndex[c.name] = i);
  return colPropertiesIndex;
}

function hasRequiredProperties(properties, row, colPropertiesIndex) {
  return properties.every(prop => row[colPropertiesIndex[prop]] != null);
}