import React, { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie } from '../helpers/auth';
import Header from './Header';
import Footer from './Footer';
import { isAuth } from '../helpers/auth';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Subscription = ({ history }) => {
  const [values, setValues] = useState({
    checked: false,
  });

  const {checked} = values;
  const handleChange = () => {
    const temp = !checked;
    setValues({...values, checked: temp});
  }

  const handlePurchase = async (product) => {
    if (!isAuth()) {
      history.push("/login")
    } else {

      // Get Stripe.js instance
      const stripe = await stripePromise;
      // Call your backend to create the Checkout Session
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/checkout`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`,
          },
          body: JSON.stringify({
            product,
          })
      });

      const res = await response.json();
      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: res.sessionId,
      });

      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        toast.error(result.error.message)
      }
    }
  }

  const subscriptionForm = () => {
    return (
     <> 
     <div className="row">
       <div className="col-md-2"></div>
        <div className="col-md-10">
        <h1>Upgrade your links</h1>
        <p>Get one essential solution to generate, share and track links for every form of communication. Choose your plan below with 3 days free trial.</p>
        <div className="d-flex">
        <p className="mr-3">Save up to 33% when you pay annually.</p>
            <div className='custom-control custom-switch custom-switch-lg'>
              <input
                type='checkbox'
                className='custom-control-input'
                id='customSwitches'
                checked={ values.checked }
                onChange={ handleChange }
              />
              <label className='custom-control-label' htmlFor='customSwitches'>
                Switch Subscription Plan
              </label>
            </div>
          </div> 
        </div> 
     </div>

    <section className="pricing py-5">
        <div className="row">
          <div className="col-lg-2"></div>
          {/* <!-- Plus Tier --> */}
          <div className="col-lg-4">
            <div className="card mb-5 mb-lg-0">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase text-center">Basic</h5>
                { checked ? <h6 className="card-price text-center">$5<span className="period">/month</span></h6>
                : <h6 className="card-price text-center">$50<span className="period">/year</span></h6>
                }

                <hr />
                <ul className="fa-ul">
                  <li><span className="fa-li"><i className="fas fa-check"></i></span><strong>Create and share branded links</strong></li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Basic email support</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Redirect any link</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Bulk link shortening</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Emoji Generator</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Dedicated Phone Support</li>
                  <li className="text-muted"><span className="fa-li"><i className="fas fa-times"></i></span>Monthly Status Reports</li>
                </ul>
                <button className="btn btn-block btn-primary text-uppercase" onClick={() => {
                  if (checked) {
                    handlePurchase("Basic Monthly")
                  } else {
                    handlePurchase("Basic Annually")
                  }
                }}>Purchase</button>
              </div>
            </div>
          </div>

          {/* <!-- Pro Tier --> */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-muted text-uppercase text-center">Pro</h5>
                { checked ? <h6 className="card-price text-center">$10<span className="period">/month</span></h6>
                : <h6 className="card-price text-center">$100<span className="period">/year</span></h6>
                }

                <hr />
                <ul className="fa-ul">
                  <li><span className="fa-li"><i className="fas fa-check"></i></span><strong>Advanced analytics</strong></li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>QR Codes</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Campaigns</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>At scale link generation</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Mobile deep links</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Dedicated Phone Support</li>
                  <li><span className="fa-li"><i className="fas fa-check"></i></span>Monthly Status Reports</li>
                </ul>
                <button className="btn btn-block btn-primary text-uppercase" onClick={() => {
                  if (checked) {
                    handlePurchase("Pro Monthly")
                  } else {
                    handlePurchase("Pro Annually")
                  }
                }}>Purchase</button>
              </div>
            </div>
          </div>

          <div className="col-lg-2"></div>
    
      </div>
    </section>
    </>
    )
  }

  return (
    <>
      <Header />
        <ToastContainer />
        {subscriptionForm()}
      <Footer />
    </>
  );
}


export default Subscription;