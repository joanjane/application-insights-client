import mock from './BasicTraceMock.json';
import sampleMock from './SampleMock.json';

const HttpMock = { };

const BasicTraceMockQuery = 'https://api.applicationinsights.io/v1/apps/BasicTraceMock/query?query=';
HttpMock[`${BasicTraceMockQuery}traces%20%7C%20sort%20by%20timestamp%20desc%20%7C%20limit%2050`] = {
  response: mock,
  status: 200
};

HttpMock[`${BasicTraceMockQuery}traces`] = {
  response: mock,
  status: 200
};

const SampleQuery = 'https://api.applicationinsights.io/v1/apps/Sample/query?query=';
HttpMock[`${SampleQuery}traces%20%7C%20sort%20by%20timestamp%20desc%20%7C%20limit%2050`] = {
  response: sampleMock,
  status: 200
};

HttpMock[`${SampleQuery}traces`] = {
  response: sampleMock,
    status: 200
};


export default HttpMock;