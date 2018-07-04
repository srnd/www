import React from 'react'
import { graphql } from 'gatsby'
import appContext from '../../Context'

import './index.sass'

export default appContext(({ context, ...props }) => (
    <div className={`all-sponsors type-${props.type || 'default'}`}>
        <ul className="major">
            { context.majorSponsors.map((sponsor) => (
                <li key={sponsor.id}>
                    <a href={sponsor.link} rel="noopener noreferrer" target="_blank">
                        <img src={sponsor.logo.large.src} alt={sponsor.name} />
                    </a>
                </li>
            ))}
        </ul>
        <ul className="minor">
            { context.minorSponsors.map((sponsor) => (
                <li key={sponsor.id}>
                    <a href={sponsor.link} rel="noopener noreferrer" target="_blank">
                        <img src={sponsor.logo.small.src} alt={sponsor.name} />
                    </a>
                </li>
            ))}
        </ul>
    </div>
));

export const query = graphql`
    fragment SponsorsFragmentItems on ContentfulGlobalSponsor {
        name
        type
        link
        id
        logo {
            large: resize(width: 150, quality: 80) {
                src
            }
            small: resize(width: 100, quality: 70) {
                src
            }
        }
    }
`;
