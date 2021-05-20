import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { isAuth } from '../helpers/auth';
import { Redirect, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }

    console.log(token, name);
  }, [match.params]);
  const { name, token, show } = formData;

  const handleSubmit = e => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/activation`, {
        token
      })
      .then(res => {
        setFormData({
          ...formData,
          show: false
        });

        toast.success(res.data.message);
      })
      .catch(err => {
        
        toast.error(err.response.data.errors);
      });
  };

  const activateForm = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="card col-10 col-md-8 col-lg-6 p-5 m-auto shadow">
            <div className="card-body">
              <h3 className='text-dark text-center mb-3'>
                Welcome {name}
              </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-label-group shadow-sm rounded">
                <button
                  type='submit'
                  className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" 
                >
                  <i className='fas fa-hand-point-right' />
                  <span className='ml-3'>Activate your Account</span>
                </button>
              </div>


              <Link className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" to='/signup'><i className='fas fa-user-plus' />
                  <span className='ml-4'>Sign Up</span></Link>

              <Link className="btn btn-lg btn-block mt-4 text-white mb-3 shadow-sm rounded form-btn" to='/login'><i className='fas fa-sign-in-alt' />
              <span className='ml-4'>Sign In</span></Link>
            </form>
          </div>
        </div>
        
      </div>
    </div>
    )
  }
  
  return (
    <>
      <Header />
      {isAuth() ? <Redirect to='/profile' /> : null}
      <ToastContainer />
      {activateForm()}
      <Footer />
    </>
  );
};

export default Activate;
