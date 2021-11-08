import React from "react"
import styled from "styled-components"

import ProfileImage from "images/profile.png"

import {
  FaGithub,
  FaKaggle,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaLink,
  FaEnvelope,
} from "react-icons/fa"

import { description, author, links } from "../../../blog-config"

const BioWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`

const Profile = styled.div`
  flex: 0 0 auto;
  margin-right: 16px;
  width: 128px;
  height: 128px;
  border-radius: 999px;
  background-image: url(${ProfileImage});
  background-size: cover;
  background-position: center;
`

const Author = styled.div`
  margin-bottom: 4.8px;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`

const Description = styled.div`
  margin-bottom: 11.2px;
  line-height: 1.5;
  font-size: 16px;
  color: ${props => props.theme.colors.secondaryText};
`

const LinksWrapper = styled.div`
  & a {
    margin-right: 9.6px;
  }

  & svg {
    width: 25.6px;
    height: 25.6px;
    cursor: pointer;
  }

  & svg path {
    fill: ${props => props.theme.colors.icon};
    transition: fill 0.3s;
  }

  & a:hover svg path {
    fill: ${props => props.theme.colors.text};
  }
`

const Link = ({ link, children }) => {
  if (!link) return null
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

const Bio = () => {
  const { github, kaggle, instagram, facebook, linkedIn, email, etc } = links

  return (
    <BioWrapper id="bio">
      <Profile />
      <div>
        <Author>@{author}</Author>
        <Description>{description}</Description>
        <LinksWrapper>
          <Link link={github}>
            <FaGithub />
          </Link>
          <Link link={kaggle}>
            <FaKaggle />
          </Link>
          <Link link={instagram}>
            <FaInstagram />
          </Link>
          <Link link={facebook}>
            <FaFacebook />
          </Link>
          <Link link={linkedIn}>
            <FaLinkedin />
          </Link>
          <Link link={email}>
            <FaEnvelope />
          </Link>
          <Link link={etc}>
            <FaLink />
          </Link>
        </LinksWrapper>
      </div>
    </BioWrapper>
  )
}

export default Bio
