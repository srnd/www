import React from 'react'
import { graphql } from 'gatsby'

import "./index.sass"

export default ({ level, title }) => <div className="heading">{React.createElement(`h${level}`, {}, title)}</div>

export const query = graphql`
    fragment HeadingBlockItems on ContentfulLayoutBlockHeading {
        title
        level
    }
`;
