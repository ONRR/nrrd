import * as d3 from 'd3'
import slugify from 'slugify'
import currencyFormatter from 'currency-formatter'

// import ExcelJs from 'exceljs'
import { saveAs } from 'file-saver'

export const destructuringSwap = (list, iA, iB) => {
  [list[iA], list[iB]] = [list[iB], list[iA]]
  return list
}

export const formatToDollarFloat = (value, precision) => {
  return currencyFormatter.format(value, {
    symbol: '$',
    precision: precision,
    format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' }
  })
}

export const getMetricLongUnit = str => {
  const suffix = { k: 'k', M: ' million', G: ' billion' }

  return str.replace(/[kMG]/g, match => {
    return suffix[match] || match
  })
}

export const formatToDollarInt = value => {
  return currencyFormatter.format(value, {
    symbol: '$',
    precision: 0,
    format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' }
  })
}

export const formatToCommaInt = value => {
  return currencyFormatter.format(value, {
    symbol: '',
    precision: 0,
    format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' }
  })
}

export const downloadWorkbook = (type, fileName, sheetName, cols, rows) => {
  /*const workbook = new ExcelJs.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)
  worksheet.columns = cols.map(col => ({ key: col.name, header: col.title, width: 20 }))

  rows.forEach((row, index) => {
    const worksheetRow = { id: [index] }
    Object.keys(row).forEach(colKey => {
      if (worksheet.columns.findIndex(col => col.key === colKey) > -1) {
        worksheetRow[colKey] = row[colKey]
      }
    })
    worksheet.addRow(worksheetRow)
  })
  switch (type) {
  case 'excel':
    workbook.xlsx.writeBuffer({ base64: true }).then(result => {
      // eslint-disable-next-line no-undef
      saveAs(new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName)
    })
    break
  case 'csv':
    workbook.csv.writeBuffer().then(result => {
      // eslint-disable-next-line no-undef
      saveAs(new Blob([result], { type: 'text/plain;charset=utf-8' }), `${ fileName }.csv`)
    })
    break
  }*/
}

export const fetchDataFilterFromUrl = () => {
  const updatedFilter = {}
  if (typeof window !== 'undefined' && window) {
    const urlSearchParams = new URLSearchParams(window.location.search)
    for (const searchParam of urlSearchParams.entries()) {
      updatedFilter[searchParam[0]] = searchParam[1]
    }
  }
  return updatedFilter
}

export const toTitleCase = str => {
  str = str.toLowerCase().split(' ')
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join(' ')
}

export const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}

export const formatToSlug = name => {
  return slugify(name, {
    lower: true,
    // eslint-disable-next-line no-useless-escape
    remove: /[$*_+~.()'"!\:@,?]/g
  }).replace('-and-', '-')
}

export const aggregateSum = ({ data, groupByProps, sumByProps }) => {
  const doesCurrentItemExist = current => {
    let exists = true
    groupByProps.forEach(prop => {
      if (exists) {
        exists = current[prop]
      }
    })
    return exists
  }
  const findCurrentItemMatch = (current, item) => {
    let foundMatch = true
    groupByProps.forEach(prop => {
      if (foundMatch) {
        foundMatch = (item[prop] === current[prop])
      }
    })
    return foundMatch
  }
  // Clone original data so we don't change it
  const clonedData = JSON.parse(JSON.stringify(data))
  // Use a reduce function to aggregate the data
  const aggregated = clonedData.reduce((results, current) => {
    // If no value exists for the current item just skip it.
    if (doesCurrentItemExist(current)) {
      // Find the objects that match based on the criteria
      // If it finds a match then we will sum the props of the current item to the results
      const matches = results.filter((item, index) => {
        const foundMatch = findCurrentItemMatch(current, item)

        if (foundMatch) {
          sumByProps.forEach(prop => {
            results[index][prop] += current[prop]
          })
        }

        return foundMatch
      })

      // No matches found so lets just add the current item to the results array
      if (matches.length === 0) {
        results.push(current)
      }
    }

    return results
  }, [])

  return aggregated
}

export const monthLookup = month => {
  const monthNumber = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
  }

  return monthNumber[month]
}

export const roundFormatParens = (number, precision) => {
  precision = precision || 0
  let num = parseFloat(number).toFixed(precision)
  const formattedNum = num < 0 ? `(${ num *= -1 })` : num
  return formattedNum
}

export const formatDate = dateStr => {
  // dateStr YYYY-MM-DD
  const dateArr = dateStr.split('-')
  const year = dateArr[0]
  const monthNum = dateArr[1].replace(/^0+/, '') - 1 // remove leading zero and subtract month num
  const dayNum = dateArr[2].replace(/^0+/, '') // remove leading zero
  const date = [year, monthNum, dayNum]

  return date
}

const utils = {
  scrollStop: callback => {
    // Make sure a valid callback was provided
    if (!callback || typeof callback !== 'function') return

    // Setup scrolling variable
    let isScrolling

    // Listen for scroll events
    window.addEventListener(
      'scroll',
      function (event) {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling)

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(function () {
          // Run the callback
          callback()
        }, 66)
      },
      false
    )
  },

  formatToSlug: name => {
    return slugify(name, {
      lower: true,
      // eslint-disable-next-line no-useless-escape
      remove: /[$*_+~.()'"!\:@,?]/g
    }).replace('-and-', '-')
  },

  formatToDollarInt: value => {
    return currencyFormatter.format(value, {
      symbol: '$',
      precision: 0,
      format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' }
    })
  },

  formatToCommaInt: value => {
    return currencyFormatter.format(value, {
      symbol: '',
      precision: 0,
      format: { pos: '%s%v', neg: '(%s%v)', zero: '%s%v' }
    })
  },
  throttle: (callback, limit) => {
    let wait = true // Initially, we're not waiting
    return function () {
      // We return a throttled function
      if (wait) {
        // If we're not waiting
        wait = false // Prevent future invocations
        setTimeout(function () {
          // After a period of time
          callback.call() // Execute users function
          wait = true // And allow future invocations
        }, limit)
      }
    }
  },
  groupBy (data, group) {
    const groups = {}

    data.map((item, index) => {
      let itemGroup = ''

      if (Array.isArray(group)) {
        group.forEach((entry, index) => {
          itemGroup += this.resolveByStringPath(entry, item) + '_'
        })
        itemGroup = itemGroup.slice(0, -1)
      }
      else {
        itemGroup = this.resolveByStringPath(group, item)
      }

      const list = groups[itemGroup]

      if (list) {
        list.push(item)
      }
      else {
        groups[itemGroup] = [item]
      }
    })

    return groups
  },
  sumBy (data, property) {
    let value = 0

    data.map((item, index) => {
      const propertyValue = this.resolveByStringPath(property, item)
      if (!isNaN(propertyValue)) {
        value += propertyValue
      }
    })

    return value
  },
  resolveByStringPath (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
      return prev ? prev[curr] : undefined
    }, obj)
  },
  range (start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx)
  },
  round (number, precision) {
    precision = precision || 0
    return parseFloat(number).toFixed(precision)
  },
  formatToSigFig_Dollar (value, precision) {
    // add 2 to d3 format so as not to lose precision

    const num = d3.format(`.${ precision + 2 }s`)(value)
    console.log('num: ', num)

    let suffix = num.substring(num.length - 1)
    console.log('suffix: ', suffix)
    if (suffix === 0) {
      suffix = ''
    }

    const dollarNum = formatToDollarFloat(num, precision - 1)
    const r = getMetricLongUnit(dollarNum + suffix)
    return r
  },

  bytesToSize (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  },

  hashLinkScroll () {
    const scrollToElement = () => {
      const { hash } = window.location
      if (hash !== '') {
        // Push onto callback queue so it runs after the DOM is updated,
        // this is required when navigating from a different page so that
        // the element is rendered on the page before trying to getElementById.
        setTimeout(() => {
          const id = hash.replace('#', '')
          const element = document.getElementById(id)
          if (element) element.scrollIntoView()
        }, 0)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('load', scrollToElement)
    }
  },
  toTitleCase (str) {
    str = str.toLowerCase().split(' ')
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
    }
    return str.join(' ')
  },
  compareValues (key, order = 'asc') {
    return function (a, b) {
      // eslint-disable-next-line no-prototype-builtins
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0
      }

      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

      let comparison = 0
      if (varA > varB) {
        comparison = 1
      }
      else if (varA < varB) {
        comparison = -1
      }
      return order === 'desc' ? comparison * -1 : comparison
    }
  }
}

export default utils

/**
 * This is a format transform that turns a value
 * into its si equivalent
 *
 * @param {String} str the formatted string
 * @return {String} the string with a specified number of significant figures
 */
// eslint-disable-next-line no-unused-vars
const siValue = (function () {
  const suffix = { k: 1000, M: 1000000, G: 1000000000 }
  return function (str) {
    let number
    str = str
      .replace(/(\.0+)?([kMG])$/, function (_, zeroes, s) {
        number = str.replace(s, '').toString() || str
        return +number * suffix[s]
      })
      .replace(/\.0+$/, '')
    if (number) {
      return str.slice(number.length, str.length)
    }
    else {
      return str
    }
  }
})()

// const crawlCeil = function (ymax, ceilMax, i) {
//   // When ymax is a value less than 10, the ratio of ceilMax and ymax will never
//   // be less than (1 + extentMarginOfError + extentPercent), and the function will continue
//   // be called in its parent function's while loop.

//   const sigFig = '.' + i + 's'

//   /* var sigFigCeil = +eiti.format.transform(
//     sigFig,
//     eiti.format.siValue
//   )(ceilMax); */

//   const sigFigCeil = siValue(d3.format(sigFig)(ceilMax))

//   const ceilIsLargerThanValue = sigFigCeil > +ymax
//   let ceilIsntTooBig =
//     sigFigCeil / +ymax <= 1 + extentMarginOfError + extentPercent
//   if (!ceilIsntTooBig) {
//     ceilIsntTooBig = sigFigCeil - ymax < 10 // Accomodate for small numbers if the difference is smal then this should be acceptable
//   }
//   const justRight = ceilIsLargerThanValue && ceilIsntTooBig
//   return justRight ? sigFig : ''
// }

/**
 * This function formats a number as the number of significant digits
 * with its amount (e.g. M for million, K for thousand, etc) abbreviation
 * For example:
 * 1,000,000 formats to 1M
 * @param {Number} ymax
 * @param {Number} ceilMax ymax + extent of the data set
 */
// let setSigFigs = function (ymax, ceilMax) {
//   let sigFigs = ''
//   let SF = 0
//   while (sigFigs.length < 3) {
//     SF++
//     sigFigs = crawlCeil(ymax, ceilMax, SF)
//   }
//   return sigFigs
// }
