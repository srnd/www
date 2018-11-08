import React from 'react'
import { withPrefix } from 'gatsby'
import prefContext from '../Context/prefs'

export default Inner => prefContext(class extends React.Component {
    render() {
        const track = {
            userDetails: (o) => this.push('setUserId', o.email),
            pageview: (page) => {
                this.pushMt('setDocumentTitle', page.substr(-1) === '/' ? page.substr(0, page.length - 1) : page);
                this.pushMt('trackPageView');
            },
            event: (category, event, value) => this.pushMt('trackEvent', category, event, value),
        }
        return <Inner {...this.props} push={(fn) => this.pushMt(fn)} track={track} />;
    }

    componentDidMount() {
        if (typeof(window) !== 'undefined') {
            this.pushMt('setTrackerUrl', `${process.env.GATSBY_MATOMO_URL}/ping.php`);
            this.pushMt('setSiteId', process.env.GATSBY_MATOMO_SITE);
            this.pushMt('enableHeartBeatTimer');
        }
    }

    componentDidUpdate() {
        if (typeof(window) !== 'undefined' && this.props.prefs.allowTracking) {
            // Load Matomo
            this.loadScript(withPrefix('/ping.js'));
         }
    }

    loadScript(src) {
        const id = 'async-script-'+this.hashCode(src);
        if (!document.getElementById(id)) {
            const script = document.createElement('script');
            script.id = id;
            script.type = 'text/javascript';
            script.src = src;
            script.async = true;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

    hashCode(str) {
        var hash = 0;
        
        if (str.length === 0) return hash;

        for (var i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }

        return hash;
    }

    pushMt() {
        if (typeof(window) === 'undefined' || this.props.prefs.allowTracking === false) return null;

        window._paq = window._paq || [];
        window._paq.push(Array.prototype.slice.call(arguments));
    }
})
