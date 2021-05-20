import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import {isAuth} from '../helpers/auth';
import {Redirect} from 'react-router-dom';


const ResetPassword = ({match}) => {
  const [formData, setFormData] = useState({
      password1: '',
      password2: '',
      token: '',
      textChange: 'Submit'
  });
  
  const { password1, password2, textChange, token } = formData;
    
  useEffect(() => {
      let token = match.params.token
      if(token) {
          setFormData({...formData, token})
      }
      
  }, [])
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const handleSubmit = e => {
    console.log(password1, password2)
    e.preventDefault();
    if ((password1 === password2) && password1 && password2) {
      setFormData({ ...formData, textChange: 'Submitting' });
      axios
        .put(`${process.env.REACT_APP_API_URL}/resetpassword`, {
            newPassword: password1,
            resetPasswordLink: token,
        })
        .then(res => {
          setFormData({
            ...formData,
              password1: '',
            password2: ''
          });

          toast.success(res.data.message);
        })
        .catch(err => {
          console.log(err)
          toast.error(err.response.data.error);
        });
    } else {
      toast.error('Passwords don\'t matches');
    }

    setFormData({ ...formData, textChange: 'Submitted' });
  };

  const resetPasswordForm = () => {
    return (
      <>
      <div className="container">
        <div className="row">
          <div className="card col-10 col-md-8 col-lg-6 p-5 m-auto shadow">
            <div className="card-body">
              <h4 className='text-dark text-center mb-3'>
                Reset Your Password
              </h4>

              
              <form onSubmit={handleSubmit}>
                <div className="form-label-group shadow-sm rounded">
                  <input
                  className="form-control"
                  type='password'
                  placeholder='password'
                  onChange={handleChange('password1')}
                  value={password1}
                  required autoFocus autoComplete="new-password"
                  id="inputPassword1" 
                  />
                  <label htmlFor="inputPassword1">New Password</label>
                </div>  

                <div className="form-label-group shadow-sm rounded">
                  <input
                  className="form-control"
                  type='password'
                  placeholder='Confirm password'
                  onChange={handleChange('password2')}
                  value={password2}
                  required autoComplete="new-password"
                  id="inputPassword2" 
                />
                <label htmlFor="inputPassword2">Confirm Password</label>
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
      {resetPasswordForm()}
      <Footer />
    </>
  );
};

export default ResetPassword;
