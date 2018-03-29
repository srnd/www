import React from 'react'
import "./index.sass"
import SmartLink from "../../SmartLink"

export default (props) => (
    <div className="sponsorships">
        <ul>
            {props.sponsorships.map((sponsorship) => (
                <li className={sponsorship.featured ? 'feature' : ''} key={sponsorship.id}>
                    <div className="summary">
                        <header>
                            <h4>{sponsorship.name}</h4>
                        </header>
                        <div className="amount">{sponsorship.amount}</div>
                        <p>{sponsorship.description}</p>
                        <SmartLink className="cta" to={sponsorship.ctaLink}>{sponsorship.cta}</SmartLink>
                    </div>
                    {sponsorship.benefits ? 
                        <ul className="compare">
                            {sponsorship.benefits.map((benefit) => (
                                <li key={`${sponsorship.key}-${benefit}`}>{benefit}</li>
                            ))}
                        </ul>
                    : ''}
                </li>
            ))}
        </ul>
    </div>
)

export const query = graphql`
    fragment SponsorshipsBlockItems on ContentfulLayoutBlockSponsorships {
        sponsorships {
            id
            name
            featured
            amount
            description
            cta
            ctaLink
            benefits
        }
    }
`;
