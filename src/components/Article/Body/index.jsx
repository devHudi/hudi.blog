import React, { useState, useEffect } from "react"
import styled from "styled-components"

import useOffsetTop from "hooks/useOffsetTop"

import Toc from "./Toc"
import StyledMarkdown from "./StyledMarkdown"
import PrismTheme from "./PrismTheme"
import GoogleAdvertise from "components/GoogleAdsense"

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const Body = ({ html }) => {
  const [toc, setToc] = useState([])

  const [ref, offsetTop] = useOffsetTop()

  useEffect(() => {
    setToc(
      Array.from(
        document.querySelectorAll("#article-body > h2, #article-body > h3")
      )
    )
  }, [])

  return (
    <Wrapper>
      <Toc items={toc} articleOffset={offsetTop} />

      <PrismTheme />

      <GoogleAdvertise
        client="ca-pub-2692445439426078"
        slot="2295339271"
        format="auto"
        responsive="true"
      />

      <StyledMarkdown
        id="article-body"
        dangerouslySetInnerHTML={{ __html: html }}
        itemProp="articleBody"
        ref={ref}
      />

      <GoogleAdvertise
        client="ca-pub-2692445439426078"
        slot="2295339271"
        format="auto"
        responsive="true"
      />
    </Wrapper>
  )
}

export default Body
