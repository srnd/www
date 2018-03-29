require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
      title: 'srnd.org',
      siteUrl: 'https://srnd.org', // TODO(@tylermenezes): Populate from language
  },
  plugins: [
        'gatsby-plugin-react-next',
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-yaml',
        'gatsby-plugin-offline',
        'gatsby-plugin-catch-links',
        'gatsby-plugin-sitemap',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: './src/data/',
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
