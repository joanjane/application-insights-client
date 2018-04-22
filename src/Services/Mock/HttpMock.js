import mock from './BasicTraceMock.json';

const HttpMock = {
    'https://api.applicationinsights.io/v1/apps/BasicTraceMock/query?query=traces%20%7C%20sort%20by%20timestamp%20desc%20%7C%20limit%2050&timespan=P7D': mock
};

export default HttpMock;