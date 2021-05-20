import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { isAuth } from '../helpers/auth';
import { Redirect, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
    textChange: 'Sign Up'
  });

  const { name, email, password1, password2, textChange } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (name && email && password1) {
      if (password1 === password2) {
        setFormData({ ...formData, textChange: 'Submitting' });
        axios
          .post(`${process.env.REACT_APP_API_URL}/register`, {
            name,
            email,
            password: password1
          })
          .then(res => {
            setFormData({
              ...formData,
              name: '',
              email: '',
              password1: '',
              password2: '',
              textChange: 'Submitted'
            });

            toast.success(res.data.message);
          })
          .catch(err => {
            setFormData({
              ...formData,
              name: '',
              email: '',
              password1: '',
              password2: '',
              textChange: 'Sign Up'
            });
            console.log(err.response);
            toast.error(err.response.data.errors);
          });
      } else {
        toast.error("Passwords don't matches");
      }
    } else {
      toast.error('Please fill all fields');
    }
  };

  const signUpForm = () => {
    return (
      <>
      <div className="container">
        <div className="row">
            <div className="card col-10 col-md-8 col-lg-6 p-5 m-auto shadow">
              <div className="card-body">
              <h1 className='display-4 text-dark text-center mb-3'>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                  
                    <div className="form-label-group shadow-sm rounded">
                      <input
                        className="form-control"
                        type='text'
                        placeholder='Name'
                        onChange={handleChange('name')}
                        value={name}
                        required autoFocus autoComplete="new-name"
                        id="inputName" 
                      />
                      <label htmlFor="inputName">Username</label>
                    </div>

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

                    <div className="form-label-group shadow-sm rounded">
                      <input
                        className="form-control"
                        type='password'
                        placeholder='Password'
                        onChange={handleChange('password1')}
                        value={password1}
                        id="inputPassword1" 
                        required
                        autoComplete="new-password" 
                      />
                      <label htmlFor="inputPassword1">New password</label>
                  </div>

                  <div className="form-label-group shadow-sm rounded">
                    <input
                      className="form-control"
                      type='password'
                      placeholder='Confirm Password'
                      onChange={handleChange('password2')}
                      value={password2}
                      id="inputPassword2" 
                      required autoComplete="confirm-password"
                    />
                    <label htmlFor="inputPassword2">Confirm password</label>
                  </div>

                  <button
                    type='submit'
                    className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" 
                  >
                    <i className='fas fa-user-plus fa' />
                    <span className='ml-3'>{textChange}</span>
                  </button>

                  <div className="mt-4">
                    <div className="d-flex justify-content-center links">
                      Already have an account? <Link to='/login' className="ml-2">Sign In</Link>
                    </div>

                    <div className="d-flex justify-content-center links">
                        <Link to='/login'>
                          Social Login
                      </Link>
                    </div>
                  </div>

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
      {signUpForm()}
      <Footer />
    </>
  );
};

export default Signup;
