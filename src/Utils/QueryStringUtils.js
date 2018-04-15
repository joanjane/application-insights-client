class QueryStringUtils {
    getParams() {
        if (!window.location) {
            return {};
        }

        const query = window.location.search;
        if (!query) {
            return {};
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                let [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {});
    }

    removeParams() {
        if (!window.history) {
            return;
        }
        window.history.pushState({}, '', '/');
    }
}

export default new QueryStringUtils();