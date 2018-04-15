import React from 'react'

export default Inner => class extends React.Component {
    render() {
        if (typeof(window) === 'undefined') return null;

        this.countly = window.Countly || {};
        this.countly.q = this.countly.q || [];

        const track = {
            userDetails: (o) => this.withCountly((countly) => countly.user_details(o)),
            pageview: (page) => this.withCountly((countly) => countly.track_pageview(page)),
            event: (event, data) => this.withCountly((countly) => countly.add_event(Object.assign({key: event}, data))),
        }
        return <Inner {...this.props} withCountly={(fn) => this.withCountly(fn)} track={track} />;
    }

    componentDidMount() {
        if (typeof(window) !== 'undefined' && !document.getElementById("cly_script")) {
            var clyScript = document.createElement("script");
            clyScript.id = "cly_script";
            clyScript.type = "text/javascript";
            clyScript.src = `${process.env.GATSBY_COUNTLY_URL}/sdk/web/countly.min.js`;
            clyScript.async = true;
            clyScript.onload = () => {
                window.Countly.q = this.countly.q;
                this.countly = window.Countly;
                this.countly.init({
                    app_key: process.env.GATSBY_COUNTLY_KEY,
                    url: process.env.GATSBY_COUNTLY_URL
                });
                this.countly.track_sessions();
            };
            document.body.appendChild(clyScript);
        }
    }

    withCountly(fn) {
        this.countly.q.push(() => fn(this.countly));
    }
}
