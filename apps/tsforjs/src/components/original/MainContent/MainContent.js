import React from 'react'
import styled from 'styled-components'
import {Footer} from '../Footer'
import {Instructor} from './Instructor'
import {SubscribeForm} from '../Form/SubscribeForm'
import {Header} from '../Header'
import {AboutThisCourse} from './AboutThisCourse'
import {
  HeaderText,
  Container,
  Content,
  Title,
  Line,
  For,
  SignUp,
  FooterContainer,
} from '../styles'

const Filler = styled.div`
  height: 25vh;
`
export const MainContent = () => {
  return (
    <Container>
      <Content>
        <Header />
        <Filler />
        <Title>
          <Line>
            <HeaderText>TypeScript</HeaderText>
            <For>for</For>
            <HeaderText>JavaScript</HeaderText>
          </Line>
          <Line>
            <HeaderText>Developers</HeaderText>
          </Line>
          <SignUp>(coming Fall 2022)</SignUp>

          <Instructor />
        </Title>
        <AboutThisCourse />
        <FooterContainer>
          <SubscribeForm />
          <Footer />
        </FooterContainer>
      </Content>
    </Container>
  )
}

export default MainContent
