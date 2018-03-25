import React from 'react'
import "./index.sass"

export default (props) => (
    <div className={`quote ${props.photo ? 'with-photo' : ''}`}>
        {props.photo ? <img src={props.photo.responsiveResolution.src} srcSet={props.photo.responsiveResolution} /> : ''}
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
            responsiveResolution(width: 455) {
                src
                srcSet
            }
        }
    }
`;
