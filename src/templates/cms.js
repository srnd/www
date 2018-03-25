import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Content from '../components/Content';
import Metadata from '../components/Metadata';
import {Header, Footer} from '../components/Navigation';
import PageHeader from '../components/Header';

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

class CmsTemplate extends React.Component {
    render() {
        const data = this.props.data;
        const layout = data.contentfulLayout;
        return (
            <div className={`page ${layout.pageClass}`}>
                <Helmet title={layout.title} />
                <Metadata metadata={layout.metadata} />
                <Header nav={ data.navPrimary } />
                <PageHeader {...layout.header} />
                <Content items={ layout.content } translate={ translate(data.translations) } />
                <Footer nav={ data.navSecondary } legal={ data.navLegal } />
            </div>
        );
    }
}

export default CmsTemplate;
export const pageQuery = graphql`
    query CmsPage($lang: String!, $slug: String!) {
        contentfulLayout(node_locale: {eq: $lang}, slug: {eq: $slug}) {
            title
            pageClass
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
        translations: allContentfulString {
            edges {
                node {
                    key
                    value { value }
                }
            }
        }
    }
`;
