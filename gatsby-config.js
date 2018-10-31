require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
      title: process.env.SITE_NAME,
      siteUrl: process.env.SITE,
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
                name: process.env.SITE_NAME,
                short_name: process.env.SITE_NAME,
                start_url: "/",
                background_color: "#ffffff",
                theme_color: "#ff686b",
                display: "browser",
                icon: "src/components/Metadata/favicon.png",
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images/`,
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
        {
            resolve: 'gatsby-source-wordpress',
            options: {
                baseUrl: process.env.WORDPRESS_DOMAIN,
                protocol: 'https',
                hostingWPCOM: true,
                useACF: false,
                auth: {
                    wpcom_app_clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
                    wpcom_app_clientId: process.env.WORDPRESS_CLIENT_ID,
                    wpcom_user: process.env.WORDPRESS_USER,
                    wpcom_pass: process.env.WORDPRESS_PASS,
                },
                includedRoutes: [
                    "**/posts",
                    "**/media",
                ]
            }
        }
  ],
};
