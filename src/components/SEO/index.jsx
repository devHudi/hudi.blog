import React from "react"
import { Helmet } from "react-helmet"
import { siteUrl } from "../../../blog-config"

const SEO = ({ title, description, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}

      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-9EMQVPHMY6"
      ></script>
      <script>
        {`window.dataLayer = window.dataLayer || []; function gtag()
        {dataLayer.push(arguments)}
        gtag('js', new Date()); gtag('config', 'G-9EMQVPHMY6');`}
      </script>
    </Helmet>
  )
}

export default SEO
