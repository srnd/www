import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Content from '../components/Content'
import Metadata from '../components/Metadata'
import {Header, Footer} from '../components/Navigation'
import PageHeader from '../components/Header'
import { ProvidesAppContext } from '../components/Context'
import WithTracking from '../components/Track'
import Retarget from '../components/Track/retarget'
import DonationMatch from '../components/Fragments/DonationMatch'
import Popup from 'react-popup';

import "./page.sass"

const translate = function(strings) {
    let translations = {};
    for (let translation of strings.edges) {
        translations[translation.node.key] = translation.node.value.value;
    }

    return function (key) {
        return translations[key] || key;
    }
};

class _CmsTemplate extends React.Component {
    render() {
        const data = this.props.data;
        const layout = data.contentfulLayout;
        const context = Object.assign(data, {translate: translate(data.translations)});
        this.props.track.pageview(layout.slug);
        return (
            <ProvidesAppContext {...context}>
                <div className={`page ${layout.pageClass}`}>
                    <Popup />
                    <Helmet title={layout.title} />
                    <Metadata metadata={layout.metadata} />
                    <Header nav={ data.navPrimary } active={layout.slug} />
                    <PageHeader {...layout.header} />
                    <Content translate={ translate(data.translations) } {...layout} />
                    <Footer nav={ data.navSecondary } legal={ data.navLegal } />
                    <Retarget type={ layout.audience } />
                </div>
            </ProvidesAppContext>
        );
    }
}

export default WithTracking(_CmsTemplate);
export const pageQuery = graphql`
    query CmsPage($lang: String!, $slug: String!) {
        contentfulLayout(node_locale: {eq: $lang}, slug: {eq: $slug}) {
            title
            pageClass
            slug
            audience
            ...MetadataItems
            ...HeaderItems
            ...ContentItems
        }
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
