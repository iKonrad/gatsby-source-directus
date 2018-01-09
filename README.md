# gatsby-source-directus

Source plugin for pulling data into [Gatsby](https://github.com/gatsbyjs) from
[Directus CMS](https://getdirectus.com/).


## Features

This plugin pulls all your custom tables and creates Gatsby nodes for it.

For example, if you have a `Posts` table, you'll get access to `AllDirectusPosts` and `directusPosts` queries which return values for the predefined fields for that column.

It works well with Gatsby's `createPages` function if you want to dynamically create Blog posts from Directus, for instance.

## Installation Guide

- [Install Gatsby](https://www.gatsbyjs.org/docs/)
- Install plugin with NPM `npm i gatsby-source-directus -S`
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
         * Directus API version. Defaults to 1.1
         */
        version: '1.1',
      },
    }
  ],
}
```

## Usage

For every table in Directus, the plugin will create a separate node with `Directus` prefix.

So, for your `posts` and `categories` tables, the queries would be `directusPosts`, `allDirectusPosts` and `directusCategories`, `allDirectusCategories`.

An example with Gatby's `createPages` coming soon.

## To do

For now, the plugin cares only about your tables and table items.

I'm planning to extend the plugin to include:
- Settings
- Activity
- Files

## Contributions

Feel free to contribute if you feel something's missing. 
Just clone the repo, and when you're done with changes, make sure to run `npm run build` to transpile the code to ES5.
