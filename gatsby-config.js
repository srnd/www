require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: 'srnd.org',
  },
  plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-yaml',
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
  ],
};
