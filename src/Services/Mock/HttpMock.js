import mock from './BasicTraceMock.json';

const HttpMock = {
    'https://api.applicationinsights.io/v1/apps/BasicTraceMock/query?query=traces%20%7C%20limit%20100&timespan=P7D': mock
};

export default HttpMock;