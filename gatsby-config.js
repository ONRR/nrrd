const fetch = require('isomorphic-fetch')
const { createHttpLink } = require('apollo-link-http')

const activeEnv = (process.env.CIRCLE_BRANCH === 'master') ? 'prd' : 'dev'
require('dotenv').config({
  path: `.env.${ activeEnv }`
})

const GOOGLE_ANALYTICS_ID = (activeEnv === 'prd') ? process.env.GOOGLE_ANALYTICS_ID : ''
// eslint-disable-next-line max-len
const PATH_PREFIX = (process.env.CIRCLE_STAGE === 'nrrd-preview') ? `/sites/${ process.env.CIRCLE_BRANCH }` : undefined

const config = {
  pathPrefix: PATH_PREFIX,
  siteMetadata: {
    isShutdown: process.env.isShutdown,
    title: 'Natural Resources Revenue Data',
    description:
      // eslint-disable-next-line max-len
      'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    keywords: 'Oil and gas, Coal, Renewable energy, Nonenergy minerals, Natural resource policy, Natural resource data, Extractives industries, Federal revenues, Production, 8(g) offshore revenue, offshore production, abanonded mine lands fund, mining reclamation tax, onrr state disbursement data, Native American land ownership, coal extraction, Department of the Interior, DOI, BLM coal leases, gomesa, gomesa funding, energy resource revenue, ONRR, state royalty, us eiti, solar industry, geothermal',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
    version: 'v6.3.3',
    author: '',
    dataRetrieval: {
      name: 'Data Specialists',
      email: 'onrrdatarequests@onrr.gov'
    },
    officeName: 'Office of Natural Resources Revenue',
    informationDataManagement: {
      name: 'Information and Data Management',
      street: '1849 C Street NW MS 5134',
      city: 'Washington, D.C.',
      zip: '20240',
      email: 'nrrd@onrr.gov'
    },
  },
  flags: { PRESERVE_WEBPACK_CACHE: false },
  plugins: [
    'gatsby-transformer-react-docgen',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Natural Resources Revenue Data',
        short_name: 'NRRD',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: 'minimal-ui',
        icon: 'src/images/icons/favicon.png', // This path is relative to the root of the site.
        // An optional attribute which provides support for CORS check.
        // If you do not provide a crossOrigin option, it will skip CORS for manifest.
        // Any invalid keyword or empty string defaults to `anonymous`
        crossOrigin: 'use-credentials',
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: `${ __dirname }/src/components/layouts/PageLayoutManager`
      }
    },
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // }
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon: false,
              maintainCase: true,
              removeAccents: true,
              enableCustomId: true,
            },
          },
        ],
        extensions: ['.mdx', '.md']
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${ __dirname }/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${ __dirname }/src/pages`,
        name: 'pages'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'components',
        path: `${ __dirname }/src/components`
      }
    },
    `gatsby-plugin-image`,
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'hasura',
        fieldName: 'onrr',
        createLink: () => {
          return createHttpLink({
            uri: process.env.GATSBY_HASURA_URI,
            headers: {},
            fetch,
            resolvers: {}
          })
        }
      }
    },
    {
      resolve: '@gatsby-contrib/gatsby-plugin-elasticlunr-search',
      options: {
        // Fields to index
        fields: ['title', 'description', 'tags', 'glossary'],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          Mdx: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tag || node.frontmatter.tags,
            description: node => node.frontmatter.description,
            path: node => node.fields.slug,
            glossary: node => node.frontmatter.glossary
          }
        },
        // Optional filter to limit indexed nodes
        filter: (node, getNode) => node.frontmatter.title !== ''
      }
    },
    {
      resolve: 'gatsby-plugin-anchor-links',
      options: {
        offset: -100
      }
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: process.env.GTM_ID,
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,
        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: function () {
          return {
            pageType: window.pageType,
            platform: 'nrrd_data_layer'
          }
        },
        // Specify optional GTM environment details.
        // gtmAuth: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING',
        gtmPreview: 'NRRD_CLOUD_GOV_PREVIEW_BRANCH',
        // dataLayerName: 'YOUR_DATA_LAYER_NAME',

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        // routeChangeEventName: 'YOUR_ROUTE_CHANGE_EVENT_NAME',
      }
    },
    {
      resolve: 'gatsby-plugin-remove-console',
      options: {
        exclude: ['error', 'warn'], // <- will remove all console calls except these
      }
    },
    'gatsby-plugin-use-query-params',
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        workboxConfig: {
          maximumFileSizeToCacheInBytes: 20000000
        },
      },
    },
    'gatsby-plugin-meta-redirect' // make sure to put last in the array
  ]
}

module.exports = config
