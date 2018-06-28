require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
      title: 'srnd.org',
      siteUrl: 'https://srnd.org', // TODO(@tylermenezes): Populate from language
  },
plugins: [
        'gatsby-plugin-remove-trailing-slashes',
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-catch-links',
        'gatsby-plugin-sitemap',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: "srnd.org",
                short_name: "srnd.org",
                start_url: "/",
                background_color: "#ffffff",
                theme_color: "#ff686b",
                display: "browser",
                icon: "src/components/Metadata/favicon.png",
            },
        },
        {
            resolve: 'gatsby-source-contentful',
            options: {
                spaceId: process.env.CONTENTFUL_SPACE_ID,
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
                host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com'
            },
        },
        {
            resolve: 'gatsby-source-contentful',
            options: {
                spaceId: process.env.CONTENTFUL_GLOBAL_SPACE_ID,
                accessToken: process.env.CONTENTFUL_GLOBAL_ACCESS_TOKEN,
                host: process.env.CONTENTFUL_HOST || 'cdn.contentful.com'
            },
        },
  ],
};
