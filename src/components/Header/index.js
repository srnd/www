import React from 'react'
import SmartLink from '../SmartLink'

import "./index.sass"

// TODO(@tylermenezes): Wistia
export default (props) => (
    <header className="header">
        <div>
            {props.image ? (
                props.image.responsiveResolution
                    ? <img src={props.image.responsiveResolution.src} srcSet={props.image.responsiveResolution.srcSet} alt={props.image.title} />
                    : <img src={props.image} />
            ) : ''}
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
)

export const query = graphql`
    fragment HeaderItems on ContentfulLayout {
        header {
            image {
                title
                responsiveResolution(width: 910) {
                    src
                    srcSet
                }
            }
            title
            subtext {
                subtext
            }
            ctaText
            ctaLocation
        }
    }
`;
