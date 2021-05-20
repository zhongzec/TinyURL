const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const { sendEmailWithNodemailer } = require("../helpers/email");
const Stripe = require('../helpers/stripe');


exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    User.findOne({
      email
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: 'Email has been taken'
        });
      }
    });

    const token = jwt.sign(
      {
        name,
        email,
        password
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5m'
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email, 
      subject: "Surl ACCOUNT ACTIVATION LINK",
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };
 
    sendEmailWithNodemailer(req, res, emailData);
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Link expired. Please signup again'
        });
      } else {
        const { name, email, password } = jwt.decode(token);
        const customerInfo = await Stripe.addNewCustomer(email);

        const user = new User({
          name,
          email,
          password,
          billingID: customerInfo.id,
          plan: 'none',
          endDate: null
        });

        user.save((err, user) => {
          if (err) {
            console.log('Save error', errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err)
            });
          } else {
            // add new common user

            return res.json({
              success: true,
              message: 'Signup success. Please signin'
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'error happening please try again'
    });
  }
};

exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    // check if user exist
    User.findOne({
      email
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: 'The email does not exist. Please signup'
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Email and password do not match'
        });
      }

     // check has Trialed
     const isTrialExpired = (user.plan !== 'none')
     if (isTrialExpired) {
       console.log('trial expired')
       user.hasTrial = false
       user.save()
     }
     // check if subscription has expired
     const subscriptionExpired = (user.plan === 'none')
     || (user.plan !== 'none' && user.endDate < new Date().getTime())

      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      );
      const { _id, name, email } = user;

      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          subscriptionExpired, 
        }
      });
    });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET // req.user._id
});

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    User.findOne(
      {
        email
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'The email does not exist'
          });
        }

        const token = jwt.sign(
          {
            _id: user._id
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: '10m'
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Password Reset link`,
          html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
        };

        return user.updateOne(
          {
            resetPasswordLink: token
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error:
                  'Database connection error on user password forgot request'
              });
            } else {
              sendEmailWithNodemailer(req, res, emailData);
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      error: firstError
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            error: 'Link expired. Please try again'
          });
        }

        User.findOne(
          {
            resetPasswordLink
          },
          (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error: 'Something went wrong. Try later'
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: ''
            };

            user = _.extend(user, updatedFields);

            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: 'Error resetting user password'
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`
              });
            });
          }
        );
      });
    }
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({
      error: 'User signup failed with google'
    });
  }

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT})
    .then(response => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            // check has Trialed
            const isTrialExpired = (user.plan !== 'none')
            if (isTrialExpired) {
              console.log('trial expired')
              user.hasTrial = false
              user.save()
            }
            // check if subscription has expired
            const subscriptionExpired = (user.plan === 'none')
            || (user.plan !== 'none' && user.endDate < new Date().getTime())

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name, subscriptionExpired }
            });

          } else {

            // add new google user
            let password = email + process.env.JWT_SECRET;
            const customerInfo = await Stripe.addNewCustomer(email);
            user = new User({ 
              name, email, password,
              billingID: customerInfo.id,
              plan: 'none',
              endDate: null
            });

            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name } = data;
              return res.json({
                token,
                user: { _id, email, name, subscriptionExpired: true }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    })
};

exports.facebookController = (req, res) => {
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      // .then(response => console.log(response))
      .then(response => {
        console.log(response)

        const { email, name } = response;
        User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            // check has Trialed
            const isTrialExpired = (user.plan !== 'none')
            if (isTrialExpired) {
              console.log('trial expired')
              user.hasTrial = false
              user.save()
            }
            // check if subscription has expired
            const subscriptionExpired = (user.plan === 'none')
            || (user.plan !== 'none' && user.endDate < new Date().getTime())

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name, subscriptionExpired }
            });
          } else {

            // add new facebook user
            let password = email + process.env.JWT_SECRET;
            const customerInfo = await Stripe.addNewCustomer(email);
            user = new User({ 
              name, email, password,
              billingID: customerInfo.id,
              plan: 'none',
              endDate: null
            });

            user.save((err, data) => {
              if (err) {
                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with facebook'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name } = data;
              return res.json({
                token,
                user: { _id, email, name, subscriptionExpired: true }
              });
            });
          }
        });
      })
      .catch(error => {
        res.json({
          error: 'Facebook login failed. Try later'
        });
      })
  );
};
