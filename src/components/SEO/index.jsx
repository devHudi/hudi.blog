import React from "react"
import { Helmet } from "react-helmet"

const SEO = ({ title, description, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta
        property="og:image"
        content={"https://avatars.githubusercontent.com/u/11745691?v=4"}
      />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}

export default SEO
