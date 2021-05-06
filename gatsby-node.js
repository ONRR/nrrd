const path = require('path')
const fs = require('fs')
const appRootDir = require('app-root-dir').get()
const to = require('to-case')

const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'Mdx' && node.frontmatter.title) {
    const slug = createFilePath({ node, getNode, basePath: 'pages' })
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, reporter, actions }) => {
  const { createRedirect } = actions

  return Promise.all([
    createRedirects({ graphql, reporter, createRedirect }),
    createComponentsCache({ graphql, reporter }),
    createYearsCache({ graphql, reporter })
  ])
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
      }
    }
  })
}

// Create redirects from Redirect.mdx frontmatter
const createRedirects = ({ graphql, reporter, createRedirect }) => {
  console.info('creating redirects')

  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        query redirects {
          allMdx(filter: {fileAbsolutePath: {regex: "/content-partials/Redirects/"}}) {
            nodes {
              frontmatter {
                redirects {
                  newUrl
                  oldUrl
                }
                stateRedirects
              }
            }
          }
        }
      `)
    )
  }).then(result => {
    if (result.errors) {
      reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
    }
    else {
      const redirects = result.data.allMdx.nodes[0].frontmatter.redirects
      const stateRedirects = result.data.allMdx.nodes[0].frontmatter.stateRedirects

      // standard redirects fromPath -> toPath
      redirects.forEach(element => {
        createRedirect({
          fromPath: element.oldUrl,
          toPath: element.newUrl,
          redirectInBrowser: true,
          isPermanent: true
        })
      })

      // explore state redirects
      stateRedirects.forEach(state => {
        createRedirect({
          fromPath: `/explore/${ state }/`,
          toPath: `/explore/?location=${ state.toUpperCase() }`,
          redirectInBrowser: true,
          isPermanent: true
        })
      })
    }
  })
}

const createYearsCache = ({ graphql, reporter }) => {
  console.info('creating years cache index')
  const PERIOD_FISCAL_YEAR = 'Fiscal Year'
  const PERIOD_CALENDAR_YEAR = 'Calendar Year'
  const REVENUE = 'Revenue'
  const DISBURSEMENT = 'Disbursements'
  const PRODUCTION = 'Production'
  const REVENUE_BY_COMPANY = 'Federal revenue by company'
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
      {
        onrr {
          revenue_fiscal_years: period(distinct_on: fiscal_year, where: {revenues: {revenue: {_is_null: false}, period: {period: {_eq: "Fiscal Year"}}}}, order_by: {fiscal_year: asc}) {
            fiscal_year
          }
          revenue_calendar_years: period(distinct_on: calendar_year, where: {revenues: {revenue: {_is_null: false}, period: {period: {_eq: "Calendar Year"}}}}, order_by: {calendar_year: asc}) {
            calendar_year
          }
          production_fiscal_years: period(distinct_on: fiscal_year, where: {productions: {volume: {_is_null: false}, period: {period: {_eq: "Fiscal Year"}}}}, order_by: {fiscal_year: asc}) {
            fiscal_year
          }
          production_calendar_years: period(distinct_on: calendar_year, where: {productions: {volume: {_is_null: false}, period: {period: {_eq: "Calendar Year"}}}}, order_by: {calendar_year: asc}) {
            calendar_year
          }
          disbursement_fiscal_years: period(distinct_on: fiscal_year, where: {disbursements: {disbursement: {_is_null: false}, period: {period: {_eq: "Fiscal Year"}}}}, order_by: {fiscal_year: asc}) {
            fiscal_year
          }
          disbursement_calendar_years: period(distinct_on: calendar_year, where: {disbursements: {disbursement: {_is_null: false}, period: {period: {_eq: "Monthly"}}}}, order_by: {calendar_year: asc}) {
            calendar_year
          }
          federal_revenue_by_company_calendar_years: federal_revenue_by_company(distinct_on: calendar_year, order_by: {calendar_year: asc}) {
            calendar_year
          }
        }
      }
    `).then(result => {
        if (result.errors) {
          reporter.panicOnBuild('🚨  ERROR: Loading "Create Years Cache" query', result.errors)
        }
        else {
          result.data.onrr.revenue_fiscal_years = result.data.onrr.revenue_fiscal_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.revenue_calendar_years = result.data.onrr.revenue_calendar_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.production_fiscal_years = result.data.onrr.production_fiscal_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.production_calendar_years = result.data.onrr.production_calendar_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.disbursement_fiscal_years = result.data.onrr.disbursement_fiscal_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.disbursement_calendar_years = result.data.onrr.disbursement_calendar_years.map(y => y[Object.keys(y)[0]])
          result.data.onrr.federal_revenue_by_company_calendar_years = result.data.onrr.federal_revenue_by_company_calendar_years.map(y => y[Object.keys(y)[0]])
          const allYears = {
            [REVENUE]: {
              [PERIOD_CALENDAR_YEAR]: result.data.onrr.revenue_calendar_years,
              [PERIOD_FISCAL_YEAR]: result.data.onrr.revenue_fiscal_years
            },
            [PRODUCTION]: {
              [PERIOD_CALENDAR_YEAR]: result.data.onrr.production_calendar_years,
              [PERIOD_FISCAL_YEAR]: result.data.onrr.production_fiscal_years
            },
            [DISBURSEMENT]: {
              [PERIOD_CALENDAR_YEAR]: result.data.onrr.disbursement_calendar_years,
              [PERIOD_FISCAL_YEAR]: result.data.onrr.disbursement_fiscal_years
            },
            [REVENUE_BY_COMPANY]: {
              [PERIOD_CALENDAR_YEAR]: result.data.onrr.federal_revenue_by_company_calendar_years
            }
          }
          fs.writeFileSync(
            path.join(appRootDir, '.cache/all-years.js'),
            `const ALL_YEARS = ${ JSON.stringify(allYears) }\nexport default ALL_YEARS\n`
          )
        }
      })
    )
  })
}

/**
 * Creates a index file of all the components during build time so they can be easily imported for the mdx provider to use.
 * This aids in creating mdx pages since we dont have to import components in a mdx page. This is also used in creating documentation for
 * the pattern library.
 * @param {*} graphql
 */
const createComponentsCache = ({ graphql, reporter }) => {
  console.info('creating components cache index')

  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(`
        {  
          allMdx(filter: {fileAbsolutePath: {regex: "/content-partials/"}}) {
            edges {
              node {
                parent {
                  ... on File {
                    name
                    absolutePath
                  }
                }
              }
            }
          }
          allComponentMetadata {
            nodes {
              id
              displayName
              description {
                text
              }
              parent {
                ... on File {
                  absolutePath
                  name
                }
              }
              props {
                name
                type {
                  name
                  raw
                  value
                }
                description {
                  text
                }
                required
              }
            }
          }
        }
      `).then(result => {
	        if (result.errors) {
          reporter.panicOnBuild('🚨  ERROR: Loading "Create Components Cache" query', result.errors)
	        }
	        else {
          const allComponents = result.data.allComponentMetadata.nodes.filter(node => (!node.displayName.includes('Demos'))).map(
            (node, i) =>
              Object.assign({}, node, {
                componentName: node.parent.name,
                filePath: node.parent.absolutePath,
              })
          )
          const allMdx = result.data.allMdx.edges.map(
            (node, i) => Object.assign({}, node.node, {
              displayName: node.node.parent.name,
              filePath: node.node.parent.absolutePath,
            })
          )

          let exportFileContents =
              allComponents
                .reduce((accumulator, { displayName, filePath, componentName }) => {
                  if (filePath.search('components/images/index.js') >= 0) {
                    accumulator.push(
                      `export { ${ displayName } } from "${ filePath }"`
                    )
                  }
                  else if (displayName === componentName) {
                    accumulator.push(
                      `export { default as ${ displayName } } from "${ filePath }"`
                    )
                  }
                  return accumulator
                }, [])
                .join('\n') + '\n'

          exportFileContents = exportFileContents.concat(
            allMdx
              .reduce((accumulator, { displayName, filePath }) => {
                accumulator.push(
                  `export { default as ${ displayName } } from "${ filePath }"`
                )
                return accumulator
              }, [])
              .join('\n') + '\n'
          )

          fs.writeFileSync(
            path.join(appRootDir, '.cache/components.js'),
            exportFileContents
          )
	        }
	      })
	    )
	  })
}
