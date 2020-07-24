import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import utils from '../../../../js/utils'
import * as d3 from 'd3'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'
import CONSTANTS from '../../../../js/constants'

const LOCATION_TOTAL_QUERY = gql`
  query NationwideFederal($location: [String!], $year: Int!, $period: String!) {
   revenue_summary (
      where: {
        location_type: {_in: $location},
        year: { _eq: $year },
        location_name: {_neq: ""},
        period: {_eq: $period}
      }
    ) {
      location_name
      year
      location
      total
    }
  }
`

const RevenueLocationTotal = props => {
  const { state: filterState } = useContext(DataFilterContext)
  const year = filterState[DFC.YEAR]
  const period = (filterState[DFC.PERIOD]) ? filterState[DFC.PERIOD] : DFC.PERIOD_FISCAL_YEAR

  const { loading, error, data } = useQuery(LOCATION_TOTAL_QUERY, {
    variables: { location: [CONSTANTS.NATIONWIDE_FEDERAL, CONSTANTS.NATIVE_AMERICAN], year: year, period }
  })

  if (loading) return ''
  if (error) return `Error loading revenue data table ${ error.message }`
  let nationwideSummary = []
  let nativeSummary = []

  if (data) {
    // console.log('LocationTotal data: ', data)
    const groupedLocationData = utils.groupBy(data.revenue_summary, 'location_name')

    nationwideSummary = d3.nest()
      .key(k => k.location_name)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(groupedLocationData[CONSTANTS.NATIONWIDE_FEDERAL])
      .map(d => {
        return ({ location_name: d.key, total: d.value })
      })

    nativeSummary = d3.nest()
      .key(k => k.location_name)
      .rollup(v => d3.sum(v, i => i.total))
      .entries(groupedLocationData[CONSTANTS.NATIVE_AMERICAN])
      .map(d => {
        return ({ location_name: d.key, total: d.value })
      })

    return (
      <>
        When companies extract natural resources on federal or Native American lands and waters, they pay royalties, rents, bonuses, and other fees, much like they would to any resource owner. The Office of Natural Resources Revenue (ONRR) collects and disburses these revenues. <strong>In {period.toLowerCase()} {year}, ONRR collected {utils.formatToDollarInt(nationwideSummary[0].total)} from federal sources and {utils.formatToDollarInt(nativeSummary[0].total)} from Native American sources for a total of {utils.formatToDollarInt(nationwideSummary[0].total + nativeSummary[0].total)}</strong>.
      </>
    )
  }
}

export default RevenueLocationTotal

RevenueLocationTotal.propTypes = {
  location: PropTypes.array
}
