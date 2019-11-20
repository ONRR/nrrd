const fetch=require('isomorphic-fetch')
const {createHttpLink} = require("apollo-link-http")

// Federalist provides the BASEURL env variable for preview builds.
// https://github.com/18F/federalist-garden-build#variables-exposed-during-builds
const BASEURL = process.env.BASEURL || undefined

// Federalist provides the google_analytics env variable
const GOOGLE_ANALYTICS_ID = (process.env.google_analytics)
  ? (process.env.google_analytics[process.env.BRANCH] || process.env.google_analytics.default)
  : 'UA-33523145-1'

const config = {
  siteMetadata: {
    title: 'Natural Resources Revenue Data',
    description: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    version: 'v5.4.7',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
    author: ''
  },
    plugins: [
	`gatsby-theme-apollo`,
	
	`gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/img`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/img/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
	resolve: `gatsby-source-graphql`,
	options: {
	    typeName: `hasura`,
	    fieldName: `onrr`,
	    createLink: () => {
		return createHttpLink({
		    uri: 'https://hasura-onrr.app.cloud.gov/v1/graphql',
		    headers: {
			'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
		    },
		    fetch
		})
	    }
	}
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}


if (BASEURL) {
  config.pathPrefix = `${ BASEURL }`
}

module.exports = config
