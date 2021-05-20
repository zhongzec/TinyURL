import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import {isAuth} from '../helpers/auth';
import {Redirect} from 'react-router-dom';

const ForgetPassword = ({history}) => {
  const [formData, setFormData] = useState({
    email: '',
    textChange: 'Submit'
  });

  const { email, textChange } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (email) {
      setFormData({ ...formData, textChange: 'Submitting' });
      axios
        .put(`${process.env.REACT_APP_API_URL}/forgotpassword`, {
          email
        })
        .then(res => {
          setFormData({
            ...formData,
            email: '',
          });
          
          toast.success(`Please check your email`);
        })
        .catch(err => {
          toast.error(err.response.data.error);
        });
    } else {
      toast.error('Please fill all fields');
    }

    setFormData({ ...formData, textChange: 'Submitted' });
  };

  const ForgetPasswordForm = () => {
    return (
      <>
      <div className="container">
        <div className="row">
            <div className="card col-10 col-md-8 col-lg-6 p-5 m-auto shadow">
              <div className="card-body">
                <h1 className='display-4 text-dark text-center'>Reset Password</h1>
                  <p className='text-dark text-center'>Enter Email to reset your password</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-label-group shadow-sm rounded">
                      <input
                        className="form-control"
                        type='email'
                        placeholder='Email'
                        onChange={handleChange('email')}
                        value={email}
                        required
                        autoComplete="off"
                        id="inputEmail" 
                      />
                      <label htmlFor="inputEmail">Email</label>
                    </div>  


                <button
                    type='submit'
                    className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" 
                  >
                  <i className='fas fa-sign-in-alt' />
                  <span className='ml-3'>{textChange}</span>
                </button>
              </form>
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
      {isAuth() ? <Redirect to='/profile' /> : null}
      <ToastContainer />
      {ForgetPasswordForm()}
      <Footer />
    </>
  );
};

export default ForgetPassword;
