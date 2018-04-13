import MockHttpClient from './Mock/MockHttpClient';
import HttpClient from './HttpClient';

export default function httpClientFactory() {
    if (process.env.NODE_ENV === 'test') {
        return new MockHttpClient();
    } else {
        return new HttpClient();
    }
}