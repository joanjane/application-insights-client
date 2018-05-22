import MockHttpClient from './Mock/MockHttpClient';
import HttpClient from './HttpClient';

export default function httpClientFactory() {
    if (process.env.NODE_ENV === 'test' || process.env.REACT_APP_MODE === 'demo') {
        return new MockHttpClient();
    } else {
        return new HttpClient();
    }
}