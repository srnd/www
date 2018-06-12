import React from 'react'
import appContext from '../../Context'
import './index.sass'

export const Featured = appContext(({ context, ...props }) => (
    context.featuredAnnouncement ? (
        <a className="featured-announcement" href={context.featuredAnnouncement.link} target="_blank" rel="noopener">
            {context.featuredAnnouncement.title}
        </a>
    ): null
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
