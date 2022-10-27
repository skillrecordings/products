import {test, expect} from '@playwright/test'
test('should be able to make a purchase', async ({page}) => {
  // Go to http://localhost:3013/
  await page.goto('http://localhost:3013/')
  // Click button:has-text("Ship Accessible Apps Like a Pro")
  await page
    .locator('button:has-text("Ship Accessible Apps Like a Pro")')
    .click()
  await expect(page).toHaveURL(/checkout.stripe.com\/c\/pay\/cs_test_/)
  // Click input[name="email"]
  await page.locator('input[name="email"]').click()
  // Fill input[name="email"]
  await page.locator('input[name="email"]').fill('test@example.com')
  // Press Tab
  await page.locator('input[name="email"]').press('Tab')
  // Fill [placeholder="\31 234 1234 1234 1234"]
  await page
    .locator('[placeholder="\\31 234 1234 1234 1234"]')
    .fill('4242 4242 4242 42422')
  // Press Tab
  await page.locator('[placeholder="\\31 234 1234 1234 1234"]').press('Tab')
  // Fill [placeholder="MM \/ YY"]
  await page.locator('[placeholder="MM \\/ YY"]').fill('04 / 24')
  // Press Tab
  await page.locator('[placeholder="MM \\/ YY"]').press('Tab')
  // Click [placeholder="CVC"]
  await page.locator('[placeholder="CVC"]').click()
  // Fill [placeholder="CVC"]
  await page.locator('[placeholder="CVC"]').fill('4242')
  // Click input[name="billingName"]
  await page.locator('input[name="billingName"]').click()
  // Fill input[name="billingName"]
  await page.locator('input[name="billingName"]').fill('Test Purchase')
  // Click [placeholder="ZIP"]
  await page.locator('[placeholder="ZIP"]').click()
  // Fill [placeholder="ZIP"]
  await page.locator('[placeholder="ZIP"]').fill('98665')
  // Click [data-testid="hosted-payment-submit-button"]
  await page.locator('[data-testid="hosted-payment-submit-button"]').click()

  // Stripe will redirect to TA Thank You page with login link message

  await page
    .locator(
      'text=Please check your inbox for a login link that just got sent. test@example.com',
    )
    .click()
})
