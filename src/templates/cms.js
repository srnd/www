import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Content from '../components/Content'
import Metadata from '../components/Metadata'
import PageHeader from '../components/Header'
import BaseTemplate from './base.js'

export default class CmsTemplate extends React.Component {
    render() {
        const data = this.props.data;
        const layout = data.contentfulLayout;
        return (
            <BaseTemplate slug={layout.slug} audience={layout.audience} pageClass={layout.pageClass} data={data} locale={this.props.pageContext.lang}>
                <Helmet title={layout.title} />
                <Metadata metadata={layout.metadata} noindex={layout.dontIndex} />
                <PageHeader {...layout.header} />
                <Content {...layout} />
            </BaseTemplate>
        );
    }
}

/*eslint graphql/template-strings:0*/
export const pageQuery = graphql`
    query CmsPage($lang: String!, $slug: String!) {
        contentfulLayout(node_locale: {eq: $lang}, slug: {eq: $slug}) {
            title
            pageClass
            slug
            audience
            dontIndex
            ...MetadataItems
            ...HeaderItems
            ...ContentItems
        }
        ...BaseTemplateItems
    }
`;
