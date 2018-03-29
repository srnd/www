import React from 'react'
import SmartLink from '../SmartLink'
import Html from '../Blocks/Html'
import Img from "gatsby-image"

import "./index.sass"

// TODO(@tylermenezes): Wistia
export default (props) => (
    <div>
        <header className="header">
            <div>
                {props.image && props.image.sizes ? (
                    <Img sizes={props.image.sizes} />
                ) : null}
                <h2>{props.title}</h2>
                {props.subtext ? (
                    <p>
                        {props.subtext.subtext.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        })}
                    </p>
                ) : ''}
                {props.ctaText && props.ctaLocation ? (
                    <div className="cta">
                        <SmartLink to={props.ctaLocation}>{props.ctaText}</SmartLink>
                    </div>
                ) : ''}
            </div>
        </header>
        {props.specialHtml ? <div className="special"><Html html={{html: props.specialHtml.specialHtml}} allowReact={true} /></div> : ''}
    </div>
)

export const query = graphql`
    fragment HeaderItems on ContentfulLayout {
        header {
            image {
                title
                sizes(maxWidth: 1820, maxHeight: 660) {
                    ...GatsbyContentfulSizes_withWebp
                }
            }
            title
            subtext {
                subtext
            }
            ctaText
            ctaLocation
            specialHtml { specialHtml }
        }
    }
`;
