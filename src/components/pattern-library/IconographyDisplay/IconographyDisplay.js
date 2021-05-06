import React from 'react'

import Grid from '@material-ui/core/Grid'

import PatternLibraryCard from '../PatternLibraryCard'
import CodeBlock from '../CodeBlock'
import * as Images from '../../images'

const IconographyDisplay = ({ children }) => {
  const content = (Array.isArray(children)) ? children : [children]

  const getNotes = key => content.filter(child => child?.props.noteKeys?.includes(key))

  const IconographyContextDisplay = ({ imageKey }) => {
    return (
      <CodeBlock key={`code-block-${ imageKey }`} live={true}>
        {`<${ imageKey } />`}
      </CodeBlock>
    )
  }

  return (
    <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
      {
        Object.keys(Images).filter(key => key !== '__esModule').map(key => {
          const ImageComponent = Images[key]
          const notes = getNotes(key)

          return (
            <Grid item key={key} xs={12} sm={4} md={3}>
              <PatternLibraryCard
                title={`${ key }`}
                notes={(notes.length > 0) ? notes : undefined}
                contexts={<IconographyContextDisplay imageKey={key} />}>
                <ImageComponent />
              </PatternLibraryCard>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default IconographyDisplay
