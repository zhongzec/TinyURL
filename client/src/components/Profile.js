import React, { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { updateUser, isAuth, getCookie, signout } from '../helpers/auth';
import Header from './Header';
import Footer from './Footer';

const Profile = ({ history }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    textChange: 'Update',
    subscriptionExpired: true, 
    plan: ''
  });

  const loadProfile = () => {
    const {token} = getCookie();
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        updateUser(res, () => {
          
          console.log(res)
          const { plan, name, email, subscriptionExpired } = res.data;
          setFormData({ ...formData, plan, name, email, subscriptionExpired });
        });
      })
      .catch(err => {
        console.log(err)
        toast.error('Error To Your Information');
        if (err.response.status === 401) {
          signout(() => {
            history.push('/login');
          });
        }
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const { name, email, password, textChange, plan, subscriptionExpired } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = e => {
    const token = getCookie('token');
    console.log(token);
    e.preventDefault();
    setFormData({ ...formData, textChange: 'Submitting' });
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/user/update`,
        {
          name,
          email,
          password: password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(res => {
        updateUser(res, () => {
          toast.success('Profile Updated Successfully');
        });
      })
      .catch(err => {
        toast.error(err.response.data.error);
      });
      setFormData({ ...formData, textChange: 'Submited' });
  };

  const manageBilling = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('token')}`,
      }
    }

    fetch(`${process.env.REACT_APP_API_URL}/billing`, requestOptions)
      .then((response) => response.json())
      .then((result) => window.open(result.url, "_blank"))
      .catch((err) => toast.error(err.response.data.errors))
  };

  const profileForm = () => {
    return (
      <>
      <div className="container">
        <div className="row">
            <div className="card col-10 col-md-8 col-lg-6 p-5 m-auto shadow">
              <div className="card-body">
              <h1 className='display-4 text-dark text-center mb-3'>Profile Info</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-label-group shadow-sm rounded">
                    <input className="form-control"
                      type='email'
                      placeholder='Email'
                      disabled
                      value={email}
                    />
                  </div>   

                  <div className="form-label-group shadow-sm rounded">
                    <input className="form-control"
                      type='text'
                      placeholder='Name'
                      onChange={handleChange('name')}
                      value={name}
                    />
                  </div>  

                  <div className="form-label-group shadow-sm rounded">
                    <input className="form-control"
                      type='password'
                      placeholder='Password'
                      onChange={handleChange('password')}
                      value={password}
                    />
                  </div>  

                <button
                  type='submit'
                  className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" 
                >
                  <i className='fas fa-user-edit' />
                  <span className='ml-3'>{textChange}</span>
                </button>
            </form>
            <button className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" >Current Subscription: {plan}</button>
            <button className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn">Status: {subscriptionExpired ? "Expired": "Active"}</button>
            <button className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" onClick={manageBilling}>Check Billing Details</button>
        </div>
      </div>
     </div> 
     </div>
     </>
    )
  }

  return (
    <>
      <Header />
      {!isAuth() ? <Redirect to='/login' /> : null}
      <ToastContainer />
      {profileForm()}
      <Footer />
    </>
  );
};

export default Profile;
