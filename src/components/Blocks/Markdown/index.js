import React from 'react'
import { graphql } from 'gatsby'
import ReactMarkdown from 'react-markdown'
import './index.sass'

export default (props) => (
    <ReactMarkdown className="markdown" source={props.markdown.markdown} escapeHtml={false} />
)

export const query = graphql`
    fragment MarkdownBlockItems on ContentfulLayoutBlockMarkdown {
        markdown {
            markdown
        }
    }
`;
