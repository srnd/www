import React from 'react'
import axios from 'axios'

/*
 * Provides props:
 * - ip
 * - lat
 * - lng
 * - city
 * - state
 * - country
 * - orgName
 */
export default (Component) => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getCachedIpInfo();
    }

    render() {
        this.cacheIpInfo(this.state);
        return <Component ipInfo={this.state} {...this.props} />
    }

    componentDidMount() {
        if (!this.state)
            axios
                .get(process.env.GATSBY_API_IP_INFO)
                .then((response) => this.setState(response.data));
    }

    getCachedIpInfo() {
        if (typeof(window) === 'undefined') return;

        if (window.ipInfoCache) return window.ipInfoCache;

        if (typeof(window.localStorage) !== 'undefined' && window.localStorage['ipInfoCache']) {
            const info = JSON.parse(window.localStorage['ipInfoCache']);
            if (info && info.__expires && (new Date(info.__expires)) > (new Date())) return info;
        }

        return null;
    }

    cacheIpInfo(info) {
        if (!info) return;
        window.ipInfoCache = info;

        var expires = new Date();
        expires.setDate(expires.getDate() + 1);
        info.__expires = expires;

        if (typeof(window.localStorage) !== 'undefined') window.localStorage['ipInfoCache'] = JSON.stringify(info);
    }
}
