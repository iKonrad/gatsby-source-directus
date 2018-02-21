# gatsby-source-directus
[![Build Status](https://travis-ci.org/iKonrad/gatsby-source-directus.svg?branch=master)](https://travis-ci.org/iKonrad/gatsby-source-directus)

Source plugin for pulling data into [Gatsby](https://github.com/gatsbyjs) from
[Directus CMS](https://getdirectus.com/).


## Features

This plugin pulls all your custom tables and creates Gatsby nodes for it.

For example, if you have a `Posts` table, you'll get access to `AllDirectusPost` and `directusPost` queries which return values for the predefined fields for that column.

It works well with Gatsby's `createPages` function if you want to dynamically create Blog posts from Directus, for instance.

## Installation Guide

- [Install Gatsby](https://www.gatsbyjs.org/docs/)
- Install plugin by running npm `npm i gatsby-source-directus -S`
- Configure the plugin in `gatsby-config.js` file:

```javascript
module.exports = {
  siteMetadata: {
    title: `A sample site using Directus API`,
    subtitle: `My sample site using Directus`,
  },
  plugins: [
    {
      resolve: `gatsby-source-directus`,
      options: {
        /*
        * The base URL of Directus without the trailing slash. 
        * Example: 'example.com' or 'www.example.com'
        */
        url: `directus.example.com`,
        /*
         * Directus protocol. Can be either http or https
         */
        protocol: 'http',
        /*
         * Directus API key. You can find it on the bottom of your account settings page.
         */
        apiKey: '123456789',   
        /*
         * This plugin will automatically transform plural table names into their singular counterparts.
         * However, if the name generated isn't correct, you can overwrite it by setting the `nameExceptions` object.
         * So, on the example below, a table "Posts", will be transformed to "Article" node type.
         * This config is optional
         */
        nameExceptions: {
          posts: "Article",
        },
        /*
         * This plugin will call the Directus API with the default request parameters.
         * In case you want to override these, you can pass in a `requestParams` object.
         */
        requestParams: {
          depth: 2,
        },
      },
    },
  ],
}
```

## Usage

For every table in Directus, the plugin will create a separate node with `Directus` prefix.

So, for your `posts` and `categories` tables, the queries would be `directusPost`, `allDirectusPost` and `directusCategory`, `allDirectusCategory`.

**This plugin is using [Pluralize](https://github.com/blakeembrey/pluralize) module to transform plural table names into singular node types to conform to the Gatsby naming convention.**
If for some reason, the generated name doesn't seem right, you can overwrite the node name using the `nameExceptions` object in the plugin config. (see example above)

### Example plugin with Gatsby's `createPages`

```javascript
const path = require('path')

exports.createPages = ({ boundActionCreators, graphql }, { urlPrefix }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allDirectusPost {
              edges {
                node {
                  id
                  title
                  author
                  content
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.error('GraphQL query returned errors')
          reject(result.errors)
        }

        result.data.allDirectusPost.edges.forEach(edge => {
          try {
            let node = edge.node
            let path = `posts/${node.id}`
            createPage({
              path,
              layout: 'index',
              component: path.resolve('src/templates/post.jsx'),
              context: {
                post: node,
              },
            })
            console.log(`Generated page '${path}'`)
          }
          catch (error) {
            console.error(`Failed to generate page posts/'${path}': ${error}`)
          }
        })
      })
    )
  })
}
```

## To do

For now, the plugin cares only about your tables and table items.

I'm planning to extend the plugin to include:
- Settings
- Activity
- Files

## Contributions

Feel free to contribute if you feel something's missing. 
