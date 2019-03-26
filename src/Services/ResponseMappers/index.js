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

const propsMapper = (row, colPropertiesIndex) => {
  if (!hasRequiredProperties(['timestamp'], row, colPropertiesIndex)) {
    return null;
  }
  const model = { };
  model.timestamp = new Date(row[colPropertiesIndex['timestamp']]);
  model.severityLevel = row[colPropertiesIndex['severityLevel']] || 0;
  model.message = '';

  Object.keys(colPropertiesIndex)
    .filter(prop => prop !== 'timestamp' && prop !== 'severityLevel')
    .forEach(prop => {
      model.message += `${prop}: ${row[colPropertiesIndex[prop]]}\n`;
    });

  return model;
};


const responseMappers = {
  'trace': traceMapper,
  'exception': exceptionMapper,
  'log': traceMapper,
  'props': propsMapper
};

export function getRowMapper(row, colPropertiesIndex) {
  const itemType = row[colPropertiesIndex['itemType']];
  if (responseMappers[itemType]) {
    return responseMappers[itemType];
  }
  if (hasRequiredProperties(['timestamp', 'message'], row, colPropertiesIndex)) {
    return responseMappers['log'];
  }
  return responseMappers['props'];
}

/**
 * return a dictionary of property name and column index
 * {[columnName: string]: columnIndex: number} response
 */
export function buildColumnPropertyIndex(response) {
  const colPropertiesIndex = {};
  response.tables[0].columns.forEach((c, i) => {
    const propName = c.name || c.columnName;
    colPropertiesIndex[propName] = i;
  });
  return colPropertiesIndex;
}

export function toCamelCase(object) {
  if (Array.isArray(object)) {
    return object.map((value) => {
        if (typeof value === 'object') {
          value = toCamelCase(value);
        }
        return value;
    });
  } else if (typeof object === 'object') {
    let mappedObject = null;
    for (const objectProp in object) {
      if (!mappedObject) {
        mappedObject = {};
      }
      if (object.hasOwnProperty(objectProp)) {
        const newKey = (objectProp.charAt(0).toLowerCase() + objectProp.slice(1) || objectProp).toString();
        let value = object[objectProp];
        if (value instanceof Array || (value != null && value.constructor === Object)) {
          value = toCamelCase(value);
        }
        mappedObject[newKey] = value;
      }
    }
    return mappedObject;
  } else {
    return object;
  }
}

function hasRequiredProperties(properties, row, colPropertiesIndex) {
  return properties.every(prop => row[colPropertiesIndex[prop]] != null);
}