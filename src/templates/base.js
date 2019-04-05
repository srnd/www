import React from 'react'
import { graphql } from 'gatsby'

import ReactTooltip from 'react-tooltip'
import {Header, Footer} from '../components/Navigation'
import { ProvidesAppContext } from '../components/Context'
import { ProvidesPrefContext } from '../components/Context/prefs'
import WithTracking from '../components/Track'
import Retarget from '../components/Track/retarget'
import { getSupportedImages } from '../components/Ui/Compat'
import FontFaceObserver from 'font-face-observer'

import "./base.sass"
import { CookieNagbar } from '../components/Ui/Secure';

require('es6-object-assign').polyfill();

const translateBuilder = function(strings) {
    let translations = {};
    for (let translation of strings.edges) {
        translations[translation.node.key] = translation.node.value.value;
    }

    return function (key) {
        return translations[key] || key;
    }
};

class _BaseTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nextgenImageSupport: ['loading'],
        };
        this.translate = translateBuilder(this.props.data.translations);

        // Initial pageview
        if (this.props.slug)
            this.props.track.pageview(this.props.slug);

        getSupportedImages((supports) => this.setState({nextgenImageSupport: supports}));
    }

    render() {
        const data = this.props.data;
        const context = Object.assign(data, {translate: this.translate, slug: this.props.slug, locale: this.props.locale});
        const passContext = {translate: this.translate}

        const imageFormats = this.state.nextgenImageSupport.length === 0 ? 'no-nextgen' : this.state.nextgenImageSupport.map((x) => `with-${x}`).join(' ');

        return (
            <ProvidesAppContext {...context}>
                <div className={`page ${this.props.pageClass} ${imageFormats}`}>
                    <CookieNagbar />
                    <Header nav={ data.navPrimary } active="newsroom" />
                    {React.Children.map(this.props.children, child => React.cloneElement(child, passContext))}
                    <Footer nav={ data.navSecondary } legal={ data.navLegal } />
                    {this.props.audience ? <Retarget type={this.props.audience} /> : null}
                    <ReactTooltip place="bottom" type="light" effect="float" className="tooltip" />
                </div>
            </ProvidesAppContext>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.slug && prevProps.slug !== this.props.slug)
            this.props.track.pageview(this.props.slug);
    }
}

export default ProvidesPrefContext(WithTracking(_BaseTemplate));
export const pageQuery = graphql`
    fragment BaseTemplateItems on Query {
        navPrimary: contentfulNavigation (node_locale: {eq: $lang}, slot: {eq: "primary"}) {
            ...NavigationItems
        }
        navLegal: contentfulNavigation (node_locale: {eq: $lang}, slot: {eq: "legal"}) {
            ...NavigationItems
        }
        navSecondary: contentfulNavigation (node_locale: {eq: $lang}, slot: {eq: "secondary"}) {
            ...NavigationItems
        }
        translations: allContentfulString (filter: {node_locale: {eq: $lang}}) {
            edges {
                node {
                    key
                    value { value }
                }
            }
        }
        ...AppContextItems
    }
`;
