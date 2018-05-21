import mock from './BasicTraceMock.json';
import mock2 from './BasicTraceMock2.json';

const HttpMock = {
    'https://api.applicationinsights.io/v1/apps/BasicTraceMock/query?query=traces%20%7C%20sort%20by%20timestamp%20desc%20%7C%20limit%2050&timespan=P7D': {
        response: mock,
        status: 200
    },
    'https://api.applicationinsights.io/v1/apps/BasicTraceMock2/query?query=traces&timespan=P7D': {
        response: mock2,
        status: 200
    }
};

export default HttpMock;