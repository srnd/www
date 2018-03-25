import React from 'react'

import "./index.sass"

export default (props) => (
    <div>
        <div className="html" dangerouslySetInnerHTML={{ __html: props.html.html }} />
    </div>
)

export const query = graphql`
    fragment HtmlBlockItems on ContentfulLayoutBlockHtml {
        html {
            html
        }
    }
`;
