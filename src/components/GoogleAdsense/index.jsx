import React, { useEffect } from "react"

const GoogleAdvertise = ({
  className = "adsbygoogle",
  client = "",
  slot = "",
  format = "",
  responsive = "",
  layoutKey = "",
}) => {
  useEffect(() => {
    try {
      // eslint-disable-next-line no-extra-semi
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      console.log("Advertise is pushed")
    } catch (e) {
      if (process.env.NODE_ENV !== "production")
        console.error("AdvertiseError", e)
    }
  }, [])
  return (
    <ins
      className={className}
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        display: "block",
        textAlign: "center",
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-ad-layout-key={layoutKey}
    />
  )
}

export default GoogleAdvertise
