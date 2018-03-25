import React from 'react'
import Helmet from 'react-helmet'
import header from "./404.jpg"

import {Header, Footer} from '../components/Navigation';
import PageHeader from '../components/Header';

export default ({ data }) => (
    <div className="page">
        <Helmet title={data.title.value.value} />
        <Header nav={ data.navPrimary } />
        <PageHeader image={header} title={data.title.value.value} subtext={{subtext: data.text.value.value}} />
        <Footer nav={ data.navSecondary } legal={ data.navLegal } />
    </div>
)

export const pageQuery = graphql`
    query Error404PageQuery {
        title: contentfulString (key: {eq: "error.404.title"}) {
            value {
                value
            }
        }
        text: contentfulString (key: {eq: "error.404.text"}) {
            value {
                value
            }
        }
        navPrimary: contentfulNavigation (slot: {eq: "primary"}) {
            ...NavigationItems
        }
        navLegal: contentfulNavigation (slot: {eq: "legal"}) {
            ...NavigationItems
        }
        navSecondary: contentfulNavigation (slot: {eq: "secondary"}) {
            ...NavigationItems
        }
    }
`;
