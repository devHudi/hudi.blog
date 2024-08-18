import React from "react"
import { graphql } from "gatsby"

import Layout from "components/Layout"
import SEO from "components/SEO"
import Bio from "components/Bio"
import VerticalSpace from "components/VerticalSpace"
import Article from "components/Article"
import Tab from "components/Tab"

import NotFoundPage from "pages/404"

import styled from "styled-components"

import { title, description, siteUrl, useAbout } from "../../blog-config"

const ArticleTitle = styled.h1`
  margin-bottom: 30px;
  line-height: 1.2;
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const BlogIndex = ({ data }) => {
  const aboutPost = data.markdownRemark
  const postsCount = data.allMarkdownRemark.totalCount

  if (!useAbout) return <NotFoundPage />

  return (
    <Layout>
      <SEO title={title} description={description} url={siteUrl} />
      <VerticalSpace size={48} />
      <Bio />
      <Tab postsCount={postsCount} activeTab="about" />
      <Article>
        <ArticleTitle>{aboutPost.frontmatter.title}</ArticleTitle>
        <Article.Body html={aboutPost.html} />
        <Article.Footer />
      </Article>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    markdownRemark(fileAbsolutePath: { regex: "/contents/about/" }) {
      html
      frontmatter {
        title
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/contents/posts/" } }
    ) {
      totalCount
    }
  }
`
