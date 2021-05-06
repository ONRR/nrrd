import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      file(relativePath: {eq: "logos/IRS-mark.png"}) {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  `)

  return (
    <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Internal Revenue Service'} {...rest}/>
  )
}
