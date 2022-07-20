import styled from 'styled-components'

import {Colors} from '../../util/Colors'
import {Emoji} from '../../util/util'

const FooterContainer = styled.footer`
  margin-top: 30vh;
  width: 100%;
  text-align: center;
  height: 8vh;
  bottom: 0px;
  color: ${Colors.mainWhite};
  align-content: bottom;
`

export const Footer = () => {
  return (
    <FooterContainer>
      made with <Emoji symbol="💖" label="sparking heart" /> by Shaundai Person
    </FooterContainer>
  )
}
