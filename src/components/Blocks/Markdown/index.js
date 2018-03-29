import React from 'react'
import ReactMarkdown from 'react-markdown'

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
