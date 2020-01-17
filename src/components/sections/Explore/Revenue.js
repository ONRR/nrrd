import React from 'react'
import Explore from './Explore'
import { ExploreDataLink } from '../../layouts/IconLinks/ExploreDataLink'

const Revenue = props => {
  return (
    <Explore
      title="revenue"
      contentLeft={
        <>
          <ExploreDataLink to="/explore/#revenue" icon="data">
            Revenue trends
          </ExploreDataLink>
          <ExploreDataLink to="/query-data/?dataType=Revenue" icon="filter">
            Revenue in detail
          </ExploreDataLink>
          <ExploreDataLink
            to="/how-it-works/federal-revenue-by-company/2018/"
            icon="data"
          >
            Revenue by company
          </ExploreDataLink>
        </>
      }
      contentCenter={
        <ExploreDataLink to="/how-it-works/#revenues" icon="works">
          How revenue works
        </ExploreDataLink>
      }
      contentRight={
        <ExploreDataLink to="/downloads/#revenue" icon="download">
          Downloads and documentation
        </ExploreDataLink>
      }
    />
  )
}

export default Revenue
