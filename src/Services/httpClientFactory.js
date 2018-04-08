import HttpClient from './HttpClient';
import MockHttpClient from './Mock/MockHttpClient';
import environment from '../environment';

export default function httpClientFactory() {
    if (environment.name === 'test') {
        return new MockHttpClient();
    } else {
        return new HttpClient();
    }
}