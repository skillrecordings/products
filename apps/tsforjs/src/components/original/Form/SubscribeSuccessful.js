import styled from 'styled-components'
import {Colors} from '../../util/Colors'
import {Link} from 'react-router-dom'
import {HeaderText, Container, Content} from '../styles'
import {Emoji} from '../../util/util'

const SuccessPage = styled(Content)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
`

const SuccessText = styled.div`
  font-size: 15px;
`

export const BackLink = styled(Link)`
  font-weight: bold;
  display: block;
  font-size: 20px;
  position: relative;

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

export const SubscribeSuccessful = () => {
  return (
    <Container>
      <SuccessPage>
        <div>
          <HeaderText>Hey, you made it!</HeaderText>
          <SuccessText>
            You're on your way to becoming a TypeScript wizard. Check your email
            to confirm your subscription.
          </SuccessText>
        </div>
        <div style={{fontSize: '80px'}}>
          <Emoji symbol="🥳" label="Party Face" />
        </div>
        <BackLink to="/">Back to main site</BackLink>
      </SuccessPage>
    </Container>
  )
}

export default SubscribeSuccessful
