import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Link from '../Link'
import { Index } from 'elasticlunr'
import 'url-search-params-polyfill' // Temporary polyfill for EdgeHTML 14-16

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// import GlossaryTerm from '../components/GlossaryTerm/GlossaryTerm'

export const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  mainContent: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2)
  },
  searchResultsContainer: {
    minHeight: '500px',
    maxWidth: '100%'
  }
}))

const GlossaryResult = ({ item, queryString, index }) => {
  const glossaryTerms = item.glossary
  const foundTerms = glossaryTerms.filter(item => item.includes(queryString))
  return foundTerms.map(term => {
    const fChar = term.charAt(0).toUpperCase()
    const hash = fChar === '8' ? '#' : `#${ fChar }`
    return <li key={index}><Link href={ `${ item.path }${ hash }` } linkType="default">{ `${ term } | ${ item.title }` }</Link></li>
  })
}

export const SearchResults = () => {
  const classes = useStyles()
  /* const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `
  )

  const index = Index.load(data.siteSearchIndex.index)
  console.log(index)
  let urlParams = new URLSearchParams()
  if (typeof window !== 'undefined' && window) {
    urlParams = new URLSearchParams(window.location.search)
  }
  const queryString = urlParams.get('q')
  const [results] = useState(index
    .search(queryString, {})
    // Map over each ID and return the full document
    .map(({ ref }) => index.documentStore.getDoc(ref))
  )

  // console.log('SearchResults results: ', results)

  return (
    <>
      <Container maxWidth="lg">
        <section className={classes.mainContent}>
          <Typography variant="h1" id="introduction" className={classes.title}>Search Results</Typography>
          <div className={classes.searchResultsContainer}>
            <article>
              <ul>
                {results.length > 0
                  ? results.map((item, index) => {
                    if (item.path !== '/glossary/') {
                      return <li key={ index }><Link href={ item.path } linkType="default">{ item.title }</Link></li>
                    }
                    else {
                      return <GlossaryResult item={item} queryString={queryString} index={index} />
                    }
                  }) : <p><strong>We didn't find any search results for " {queryString} ".</strong></p>
                }
              </ul>
            </article>
          </div>
        </section>
      </Container>
    </>
  )*/

  return (<></>)
}

export default SearchResults

/*
 {(glossaryResults.length > 0) &&
                  <Fragment>You might try searching for <GlossaryTerm>{queryString}</GlossaryTerm> in our glossary.</Fragment>}
*/
