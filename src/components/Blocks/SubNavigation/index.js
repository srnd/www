import React from 'react'
import { graphql } from 'gatsby'
import SmartLink from '../../Ui/SmartLink'
import appContext from '../../Context'

import './index.sass'

export default appContext(({ context, links }) => (
    <div className="sub-navigation">
        <ul>
            {links.map((item) => (
                <li key={item.url}>
                    <SmartLink to={item.url} className={context.slug === item.url ? 'active' : ''}>{item.title}</SmartLink>
                </li>
            ))}
        </ul>
    </div>
))

export const query = graphql`
    fragment SubNavigationBlockItems on ContentfulLayoutBlockSubNavigation {
        links {
            ... on ContentfulLayout {
                title
                url: slug
            }
            ... on ContentfulExternalLink {
                title
                url
            }
        }
    }
`;
