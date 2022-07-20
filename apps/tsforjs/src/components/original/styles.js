import styled from 'styled-components'

import {Colors} from '../../util/Colors'
import {device} from '../../util/util'
import Image from 'next/image'

export const HeaderText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 5vw;
  background-color: ${Colors.mainPurpleBright};
  background-image: linear-gradient(
    45deg,
    ${Colors.mainPurpleBright},
    ${Colors.softOrange}
  );
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  @media ${device.tablet} {
    font-size: 2.7em;
  }
`

export const Container = styled.div`
  background-color: ${Colors.mainBlack};
  display: flex;
  justify-content: center;
  width: 100%;
  color: ${Colors.mainWhite};
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Title = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
`

export const Line = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  @media ${device.tablet} {
    flex-direction: column;
  }
`

export const For = styled.em`
  font-family: 'Seaweed Script';
  font-size: 4.5vw;
  color: ${Colors.coolBlue};
  margin: 0px 15px;
  @media ${device.tablet} {
    font-size: 2.3em;
    margin: 0px 8px;
  }
  @media ${device.mobile} {
    font-size: 1.5em;
    margin: 0px 8px;
  }
`

export const InstructorContainer = styled.div`
  height: 24vh;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0 0 13vh;
`

export const InstructorPic = styled(Image)`
  height: 5em;
  border-radius: 50%;
`

export const TaughtBy = styled.div`
  margin: 0px 0 0 20px;
  font-weight: 500;
  font-size: 18px;
`

export const ShaundaiNameLink = styled.a`
  font-weight: bold;
  display: block;
  font-size: 20px;
  position: relative;
  color: white;

  &:hover {
    text-decoration: none;
    color: ${Colors.mainWhite};
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    background: none repeat scroll 0 0 transparent;
    height: 2px;
    width: 0;
    background: ${Colors.softOrange};
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }
`

export const SignUp = styled.div`
  color: ${Colors.mainWhite};
  width: 100%;
  text-align: center;
  @media ${device.mobile} {
    max-width: 61%;
  }
`

export const AboutShaundai = styled.div`
  width: 75%;
  text-align: justify;
  margin-bottom: 100px;
`

export const FooterContainer = styled.div`
  margin-top: 50px;
  width: 100%;
  background-color: ${Colors.offBlack};
  display: flex;
  flex-direction: column;
  align-items: center;
`
