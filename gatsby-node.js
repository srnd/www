const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return new Promise((resolve, reject) => {
        resolve(graphql(`
            {
                allContentfulLayout(filter:{node_locale: {eq: "en-US"}}) {
                    edges {
                        node {
                            slug
                        }
                    }
                }
            }
        `).then(result => {
            if (result.errors) {
                reject(new Error(result.errors));
            }

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

            return;
        }));
    });
};
