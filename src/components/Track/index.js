import React from 'react'

export default Inner => class extends React.Component {
    render() {
        const track = {
            userDetails: (o) => this.push('setUserId', o.email),
            pageview: (page) => {
                this.push('setDocumentTitle', page.substr(-1) == '/' ? page.substr(0, page.length - 1) : page);
                this.push('trackPageView');
            },
            event: (event, data) => this.push.apply(['trackEvent', event].concat(data)),
        }
        return <Inner {...this.props} push={(fn) => this.push(fn)} track={track} />;
    }

    componentDidMount() {
        if (typeof(window) !== 'undefined' && !document.getElementById("matomo_script")) {
            var matomoScript = document.createElement("script");
            matomoScript.id = "matomo_script";
            matomoScript.type = "text/javascript";
            matomoScript.src = `${process.env.GATSBY_MATOMO_URL}/piwik.js`;
            matomoScript.async = true;
            this.push('setTrackerUrl', `${process.env.GATSBY_MATOMO_URL}/piwik.php`);
            this.push('setSiteId', process.env.GATSBY_MATOMO_SITE);
            this.push('enableHeartBeatTimer');
            document.body.appendChild(matomoScript);
        }
    }

    push() {
        if (typeof(window) === 'undefined') return null;
        window._paq = window._paq || [];
        window._paq.push(Array.prototype.slice.call(arguments));
    }
}
