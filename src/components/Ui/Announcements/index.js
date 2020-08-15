import React from 'react'
import { graphql } from 'gatsby'
import appContext from '../../Context'
import './index.sass'

export const Featured = appContext(({ context, ...props }) => (
    <a className="featured-announcement" href="https://www.codeday.org/" target="_blank" rel="noopener">
        We're changing our name! Soon we'll be known as just "CodeDay". Visit the new site at CodeDay.org.
    </a>
));

export const query = graphql`
    fragment AnnouncementUiItems on ContentfulAnnouncement {
        title
        featured
        published
        markdown { markdown }
        link
    }
`;
