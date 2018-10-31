const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const fs = require('fs');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return new Promise((resolve, reject) => {
        resolve(graphql(`
            {
                allContentfulLayout(filter:{node_locale: {eq: "${process.env.LANGUAGE || 'en-US'}"}}) {
                    edges {
                        node {
                            slug
                        }
                    }
                }
                allWordpressPost {
                    edges {
                        node {
                            slug
                            date(formatString: "YYYY-MM-DD")
                            id
                        }
                    }
                }
            }
        `).then(result => {
            if (result.errors) {
                reject(new Error(result.errors));
            }

            //////////
            // Contentful
            //////////
            const postTemplate = path.resolve(`src/templates/cms.js`);
            _.each(result.data.allContentfulLayout.edges, edge => {
                createPage({
                    path: edge.node.slug,
                    component: postTemplate,
                    context: {
                        slug: edge.node.slug,
                        lang: process.env.LANGUAGE || 'en-US'
                    },
                });
            });

            //////////
            // Wordpress Newsroom
            //////////

            // Create newsroom pages from Wordpress
            const newsTemplate = path.resolve(`src/templates/news.js`);
            _.each(result.data.allWordpressPost.edges, edge => {
                let slug = `press/news/${edge.node.date}-${edge.node.slug}`
                createPage({
                    path: slug,
                    component: newsTemplate,
                    context: {
                        id: edge.node.id,
                        slug: slug,
                        lang: process.env.LANGUAGE || 'en-US'
                    },
                });
            });


            ///////////
            // Errors
            ///////////
            _.each(['404', '404.html'], page => {
                createPage({
                    path: page,
                    component: path.resolve('src/errors/404.js'),
                    context: {
                        lang: process.env.LANGUAGE || 'en-US'
                    },
                });
            });




        }));
    });
};


exports.onPostBuild = ({ graphql, pathPrefix }, pluginOptions) => {
    return new Promise((resolve, reject) => {
            resolve(graphql(`
                {
                    allSitePage {
                        edges {
                            node {
                                path
                            }
                        }
                    }
                }
            `).then(result => {
                const lines = _.map(result.data.allSitePage.edges, edge => {
                    return `curl -X PURGE ${process.env.SITE}${edge.node.path}`;
                }).join("\n");
                fs.writeFile(path.resolve('cache-purge.sh'), lines, () => {});
            }));
    });
}
