import React from 'react'
import { graphql } from 'gatsby'
import SmartLink from '../Ui/SmartLink'
import Html from '../Blocks/Html'
import Img from "gatsby-image"

import "./index.sass"

// TODO(@tylermenezes): Wistia
export default (props) => (
    <div>
        <header className="header">
            <div>
                {props.image && props.image.fluid ? (
                    <Img fluid={props.image.fluid} />
                ) : null}
                <h2>{props.title}</h2>
                {props.subtext ? (
                    <span>
                        {(props.subtext.subtext || props.subtext).split('\n').map((item, key) => {
                            return (<p key={key}>{item}</p>);
                        })}
                    </span>
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
                fluid(maxWidth: 1820, maxHeight: 660) {
                    ...GatsbyContentfulFluid_withWebp_noBase64
                    ...GatsbyContentfulFluid_tracedSVG
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
