import styled from 'styled-components'
import {HeaderText, SignUp} from '../styles'
import {Colors} from '../../../util/Colors'
import {device} from '../../../util/util'

const SubscribeFormContainer = styled.div`
  margin-top: 140px;
  width: 575px;
  @media ${device.tablet} {
    width: 90%;
  }
`

const OuterFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 450px;
  @media ${device.tablet} {
    width: 90%;
  }
`
const Input = styled.input`
  width: 100%;
  display: block;
  border-radius: 8px;
  min-height: calc(1.5em + (1rem + 2px));
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.3rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  margin-bottom: 16px;

  &:focus,
  &:active {
    box-shadow: 0 0 0 0.25rem rgb(224 108 117 / 25%);
    color: #212529;
    background-color: #fff;
    border-color: #f0b6ba;
    outline: 0;
  }
`

const StyledHeaderText = styled(HeaderText)`
  display: flex;
  font-size: 48px;
  line-height: 1.2;
  align-self: center;
`

const SubmitContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  margin-bottom: 15px;
`

const SubmitButton = styled.button`
  border-radius: 8px;
  height: 50px;
  color: white;
  background-color: blue;
  padding: 0px 20px;
  border: 0;
  background-color: ${Colors.mainPurpleDark};
  background-image: ${Colors.mainPurpleDark};
  background-image: -moz-linear-gradient(
    top,
    ${Colors.mainPurpleBright} 0%,
    ${Colors.mainPurpleDark} 100%
  );
  background-image: -webkit-linear-gradient(
    top,
    ${Colors.mainPurpleBright} 0%,
    ${Colors.mainPurpleDark} 100%
  );
  background-image: linear-gradient(
    to bottom,
    ${Colors.mainPurpleBright} 0%,
    ${Colors.mainPurpleDark} 100%
  );
  background-size: 300px;
  background-repeat: no-repeat;
  transition: transform 0.5s;
  &:hover,
  &:active {
    transform: scale(1.1);
  }
`

const Star = styled.span`
  color: ${Colors.softOrange};
  margin-left: 2px;
`

export const SubscribeForm = () => {
  return (
    <SubscribeFormContainer>
      <div>
        <StyledHeaderText>Subscribe for Updates and Freebies</StyledHeaderText>
      </div>
      <OuterFormContainer>
        <script src="https://f.convertkit.com/ckjs/ck.5.js" />

        <form
          action="https://app.convertkit.com/forms/2282243/subscriptions"
          class="seva-form formkit-form"
          method="post"
          data-sv-form="2282243"
          data-uid="508e65a189"
          data-format="inline"
          data-version="5"
          data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"show","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'
          min-width="400 500 600 700 800"
        >
          <div data-style="clean">
            <ul data-element="errors" data-group="alert"></ul>
            <div data-element="fields" data-stacked="false">
              <div>
                <InputContainer>
                  <label for="firstName">First Name</label>
                  <Input
                    aria-label="Input first name"
                    name="fields[first_name]"
                    required
                    placeholder="First Name"
                    type="text"
                    id="firstName"
                  />
                  <label for="lastName">
                    Email<Star>*</Star>
                  </label>
                  <Input
                    name="email_address"
                    aria-label="Input email address"
                    placeholder="Email Address"
                    required
                    type="email"
                    id="lastName"
                  />
                </InputContainer>
                <SubmitContainer>
                  <SubmitButton
                    data-element="submit"
                    type="submit"
                    aria-label="submit button"
                  >
                    Subscribe
                  </SubmitButton>
                </SubmitContainer>
              </div>
            </div>
          </div>
        </form>
        <SignUp>(no spam. ever. pinky promise.)</SignUp>
      </OuterFormContainer>
    </SubscribeFormContainer>
  )
}
