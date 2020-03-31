import React, { useContext } from 'react'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import FilterList from '@material-ui/icons/FilterList'
import Grid from '@material-ui/core/Grid'

import LandCategorySelect from '../data-filters/LandCategorySelect'
import LandClassSelect from '../data-filters/LandClassSelect'
import StateSelect from '../data-filters/StateSelect'
import CountySelect from '../data-filters/CountySelect'
import RevenueTypeSelect from '../data-filters/RevenueTypeSelect'
import CommoditySelect from '../data-filters/CommoditySelect'
import OffshoreRegionSelect from '../data-filters/OffshoreRegionSelect'

import { DataFilterContext } from '../../../stores/data-filter-store'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: 300,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    }
  },
}))

export default function DataFilterDrawer () {
  const { state } = useContext(DataFilterContext)
  if (!state) {
    throw new Error('Data Filter Context has an undefined state. Please verify you have the Data Filter Provider included in your page or component.')
  }
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = open => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(open)
  }

  console.log(state)

  return (
    <div >
      <React.Fragment>
        <Button
          variant="contained"
          color="primary"
          aria-label="open data filters"
          onClick={toggleDrawer(true)}
          onKeyDown={toggleDrawer(true)}
          startIcon={<FilterList />}
          className={clsx(classes.menuButton, open && classes.hide)}
          disabled={!state.dataType}
        >
          Filter Data
        </Button>
        <SwipeableDrawer
          anchor={'left'}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <LandClassSelect />
            </Grid>
          </Grid>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  )
}


/* 


            <Grid item xs={12}>
              <LandCategorySelect />
            </Grid>
            <Grid item xs={12}>
              <LandClassSelect />
            </Grid>
            <Grid item xs={12}>
              <RevenueTypeSelect />
            </Grid>
            <Grid item xs={12}>
              <OffshoreRegionSelect />
            </Grid>

            */