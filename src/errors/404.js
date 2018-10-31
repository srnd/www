import React from 'react'
import { graphql } from 'gatsby'
import BaseTemplate from '../templates/base.js'

import PageHeader from '../components/Header';

export default ({ data }) => (
    <BaseTemplate data={data} locale="en-US">
        <PageHeader image={data.file.childImageSharp} title={data.title.value.value} subtext={{subtext: data.text.value.value}} />
    </BaseTemplate>
)

/*eslint graphql/template-strings:0*/
export const pageQuery = graphql`
    query Error404PageQuery ($lang: String!) {
        file(relativePath: { eq: "404.jpg" }) {
            childImageSharp {
                fluid(maxWidth: 1820, maxHeight: 660) {
                    ...GatsbyImageSharpFluid_withWebp_noBase64
                    ...GatsbyImageSharpFluid_tracedSVG
                }
            }
        }
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
        ...BaseTemplateItems
    }
`;
