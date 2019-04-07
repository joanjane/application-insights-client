import mock from './BasicTraceMock.json';
import sampleMock from './SampleMock.json';
import subscriptionsMock from './AADSubscriptionsMock.json';
import subscriptionAppsMock from './AADSubscriptionAppsMock.json';

const longquery = 'traces%20%7C%20sort%20by%20timestamp%20desc%20%7C%20limit%2050';
const shortquery = 'traces';
const HttpMock = { };

const BasicTraceMockQuery = 'https://api.applicationinsights.io/v1/apps/DEMO/query?query=';
HttpMock[`${BasicTraceMockQuery}${longquery}&api-version=2018-05-01-preview`] = {
  response: mock,
  status: 200
};

HttpMock[`${BasicTraceMockQuery}${shortquery}&api-version=2018-05-01-preview`] = {
  response: mock,
  status: 200
};

const SampleQuery = 'https://api.applicationinsights.io/v1/apps/Sample/query?query=';
HttpMock[`${SampleQuery}${longquery}&api-version=2018-05-01-preview`] = {
  response: sampleMock,
  status: 200
};

HttpMock[`${SampleQuery}${shortquery}&api-version=2018-05-01-preview`] = {
  response: sampleMock,
  status: 200
};

HttpMock[`https://management.azure.com/subscriptions?api-version=2015-05-01`] = {
  response: subscriptionsMock,
  status: 200
};

HttpMock[`https://management.azure.com/subscriptions//subscriptions/demo/providers/Microsoft.Insights/components?api-version=2015-05-01`] = {
  response: subscriptionAppsMock,
  status: 200
};

HttpMock[`https://management.azure.com//subscriptions/demo/resourceGroups/demo/providers/microsoft.insights/components/ail-demo/api/query?query=${longquery}&api-version=2018-05-01-preview`] = {
  response: mock,
  status: 200
}


export default HttpMock;