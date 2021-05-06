import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

export default ({ alt, ...rest }) => {
  const data = useStaticQuery(graphql`
  query {
      file(relativePath: {eq: "how-it-works/AML_OSMREmap.png"}) {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  `)

  return (
    <GatsbyImage image={data.file.childImageSharp.gatsbyImageData} alt={alt || 'Office of Surface Mining Reclamation and Enforcement\'s data site.'} {...rest}/>
  )
}
