import React from 'react'
import ReactMarkdown from 'react-markdown'

import "./index.sass"

export default (props) => React.createElement(`h${props.level}`, {className: 'heading'}, props.title);

export const query = graphql`
    fragment HeadingBlockItems on ContentfulLayoutBlockHeading {
      title
      level
    }
`;
