import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      file(relativePath: {eq: "logos/BSEE-mark.png"}) {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  `)

  return (
    <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Bureau of Safety and Environmental Enforcement'} {...rest}/>
  )
}
