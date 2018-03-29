import React from 'react'
import Img from "gatsby-image"
import "./index.sass"

export default (props) => (
    <div className={`quote ${props.photo ? 'with-photo' : ''}`}>
        {props.photo && props.photo.sizes ? <Img sizes={props.photo.sizes} /> : ''}
        <div className="text">
            <blockquote>
                <p>
                    {props.quote.quote.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                    })}
                </p>
            </blockquote>
            <div className="by">
                <div className="name">{props.author}</div>
                {props.authorTitle ? <div className="title">{props.authorTitle}</div> : ''}
            </div>
        </div>
    </div>
)

export const query = graphql`
    fragment QuoteBlockItems on ContentfulLayoutBlockQuote {
        quote {
            quote
        }
        author
        authorTitle
        photo {
            sizes(maxWidth: 455) {
                ...GatsbyContentfulSizes_withWebp
            }
        }
    }
`;
