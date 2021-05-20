const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

const createCheckoutSession = async (customerID, price) => {
  let success_url = ""
  let cancel_url = ""
  if (process.env.NODE_ENV === 'development') {
    success_url = `${process.env.CLIENT_URL}`
    cancel_url = `${process.env.CLIENT_URL}`
  } else {

    success_url = `${process.env.SERVER_URL}`
    cancel_url = `${process.env.SERVER_URL}`
  }

  const session = await Stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerID,
    line_items: [
      {
        price,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: process.env.TRIAL_DAYS
    },

    success_url,
    cancel_url,
  })

  return session
}

const createBillingSession = async (customer) => {
  let return_url = ""
  if (process.env.NODE_ENV == 'development') {
    return_url = `${process.env.CLIENT_URL}`
  } else {
    return_url = `${process.env.SERVER_URL}`
  }

  const session = await Stripe.billingPortal.sessions.create({
    customer,
    return_url,
  })
  return session
}

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id)
  return customer
}

const addNewCustomer = async (email) => {
  const customer = await Stripe.customers.create({
    email,
    description: 'New Customer'
  })

  return customer
}

const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  return event
}

module.exports = {
  getCustomerByID,
  addNewCustomer,
  createCheckoutSession,
  createBillingSession,
  createWebhook
}