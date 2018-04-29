import React from 'react'
import Helmet from 'react-helmet'
import favicon from "./favicon.png"

const types = {
    text: "twitter:summary",
    image: "twitter:summary_large_image",
    video: "twitter:player",
};
export default (props) => (
    <Helmet>
        <meta property="og:title" content={ props.metadata.title } />
        <meta name="twitter:title" content={ props.metadata.title } />
        <meta name="description" content={ props.metadata.description.description } />
        <meta property="og:description" content={ props.metadata.description.description } />
        <meta name="twitter:description" content={ props.metadata.description.description } />
        <meta property="og:image" content={ props.metadata.image.responsiveResolution.src } />
        <meta name="twitter:image" content={ props.metadata.image.responsiveResolution.src } />
        <meta name="twitter:type" content={ types[props.metadata.type] } />
        <meta name="twitter:site" content="@studentrnd" />
        <meta name="twitter:creator" content="@studentrnd" />
        <link rel="icon" type="image/png" href={favicon} />
        <link rel="apple-touch-icon" type="image/png" href={favicon} />
        <link rel="apple-touch-icon" type="image/png" sizes="72x72" href={favicon} />
        <link rel="apple-touch-icon" type="image/png" sizes="114x114" href={favicon} />
        <meta name="theme-color" content="#ff686b"/>
    </Helmet>
)

export const query = graphql`
	fragment MetadataItems on ContentfulLayout {
        metadata {
            title
            description {
                description
            }
            image {
                responsiveResolution(width: 1200, height: 630) {
                    src
                }
            }
            type
        }
	}
`;
