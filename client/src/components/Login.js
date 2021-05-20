import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { authenticate, isAuth } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Header from './Header';
import Footer from './Footer';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";


const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    textChange: 'Sign In'
  });

  const { email, password, textChange, remember } = formData;
  const handleChange = text => e => {
    setFormData({ ...formData, [text]: e.target.value });
  };
  const handleCheck = () => {
    console.log(remember)
    setFormData({ ...formData,  remember: !remember});
  }

  const sendGoogleToken = tokenId => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/googlelogin`, {
        idToken: tokenId
      })
      .then(res => {
        console.log(res.data);
        informParent(res);
      })
      .catch(error => {
        console.log('GOOGLE SIGNIN ERROR', error.response);
      });
  };
  const informParent = response => {
    authenticate(response, remember, () => {
      isAuth() ? history.push('/')
        : history.push('/signin');
    });
  };

  const sendFacebookToken = (userID, accessToken) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/facebooklogin`,
      data: { userID, accessToken },
    })
      .then(response => {
        console.log(response);
        informParent(response);
      })
      .catch(error => {
        console.log('FACEBOOK SIGNIN ERROR', error.response);
      });
  };

  const responseGoogle = response => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const responseFacebook = response => {
    console.log(response);
    sendFacebookToken(response.userID, response.accessToken)
  };

  const handleSubmit = e => {
    console.log(process.env.REACT_APP_API_URL);
    e.preventDefault();
    if (email && password) {
      setFormData({ ...formData, textChange: 'Submitting' });
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password
        })
        .then(res => {
          authenticate(res, remember, () => {
            setFormData({
              ...formData,
              email: '',
              password: '',
              textChange: 'Submitted'
            });
            isAuth() ? history.push('/')
              : history.push('/signin');
            toast.success(`Hey ${res.data.user.name}, Welcome back!`);
          });
        })
        .catch(err => {
          setFormData({
            ...formData,
            email: '',
            password: '',
            textChange: 'Sign In'
          });
          console.log(err.response);
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error('Please fill all fields');
    }
  };

  const signInForm = () => {
    return (
      <>
            <div className='container'>
              <div className="row">
                <div className="card col-11 col-md-8 col-lg-6 p-5 m-auto shadow">
                  <div className="card-body">
                    <h1 className='display-4 text-dark text-center mb-3'>Login</h1>
                    <GoogleLogin
                      clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                      render={renderProps => (
                        <GoogleLoginButton
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          align="center"
                        >
                        </GoogleLoginButton>
                      )}
                    ></GoogleLogin>

                    <FacebookLogin
                      appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                      autoLoad={false}
                      callback={responseFacebook}
                      render={renderProps => (
                        <FacebookLoginButton
                          onClick={renderProps.onClick} 
                          align="center"
                        >
                        </FacebookLoginButton>
                      )}
                    />
                
                <div>
                    <hr className="hr-text" data-content="Or Sign In with email and password"></hr>
                </div>
                
                <form
                  className="form-signin" autoComplete='off'
                  onSubmit={handleSubmit}
                >
                  <div className="form-label-group shadow-sm rounded">
                    <input
                      type='email'
                      placeholder='Email'
                      onChange={handleChange('email')}
                      value={email}
                      className="form-control" 
                      required autoFocus 
                      id="inputEmail" 
                    />
                    <label htmlFor="inputEmail">Email</label>
                  </div>

                  <div className="form-label-group shadow-sm rounded">
                    <input
                      type='password'
                      placeholder='Password'
                      onChange={handleChange('password')}
                      value={password}
                      className="form-control mt-1" 
                      required
                      id="inputPassword" 
                    />
                    <label htmlFor="inputPassword">Password</label>
                  </div>

                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id="customControlInline" onClick={() => handleCheck()}/>
                      <label className="custom-control-label" htmlFor="customControlInline">Remember me</label>
                    </div>
                  </div>

                  <button
                    type='submit'
                    className="btn btn-lg btn-block text-white shadow-sm rounded form-btn" type='submit'
                  >
                    <i className='fas fa-sign-in-alt' />
                    <span className='ml-3'>{textChange}</span>
                  </button>

                  <div className="mt-4">
                    <div className="d-flex justify-content-center links">
                      Don't have an account? <Link to='/signup' className="ml-2">Sign Up</Link>
                    </div>

                    <div className="d-flex justify-content-center links">
                        <Link to='/users/password/forget'>
                        Forget password?
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
      {signInForm()}
      <Footer />
    </>
  );
};

export default Login;
