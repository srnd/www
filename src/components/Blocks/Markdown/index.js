import React from 'react'
import ReactMarkdown from 'react-markdown'

import "./index.sass"

export default (props) => (
    <ReactMarkdown className="markdown" source={props.markdown.markdown} />
)

export const query = graphql`
    fragment MarkdownBlockItems on ContentfulLayoutBlockMarkdown {
        markdown {
            markdown
        }
    }
`;
