import first from 'lodash/first'

export const getSubscriberByEmail = async (email: string) => {
  const {subscribers} = await fetch(
    `${process.env.CONVERTKIT_BASE_URL}/subscribers?email_address=${email}&api_secret=${process.env.CONVERTKIT_API_SECRET}`,
  ).then((response) => response.json())

  const subscriber = first(subscribers)
  return subscriber
}
