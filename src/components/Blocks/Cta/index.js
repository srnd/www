import React from 'react'
import { graphql } from 'gatsby'
import SmartLink from '../../Ui/SmartLink'

import './index.sass'

export default ({ text, ctaText, ctaLocation, ...props }) => (
    <div className="cta-block">
        <SmartLink to={ctaLocation}>
            <h2>{text}</h2>
            <span className="link">{ctaText}</span>
        </SmartLink>
    </div>
);

export const query = graphql`
    fragment CtaBlockItems on ContentfulLayoutBlockCta {
        text
        ctaText
        ctaLocation
    }
`;
