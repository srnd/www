import React from 'react'
import ReactMarkdown from 'react-markdown'

import "./index.sass"

export default ({ level, title }) => <div className="heading">{React.createElement(`h${level}`, {}, title)}</div>

export const query = graphql`
    fragment HeadingBlockItems on ContentfulLayoutBlockHeading {
        title
        level
    }
`;
