const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
  check('firstName')
    .notEmpty()
    .withMessage('FirstName is required'),
  // check('lastName')
  //   .notEmpty()
  //   .withMessage('LastName is required'),
  check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
  // check('contactNumber')
  //   .isLength({ min: 10, max: 10 })
  //   .withMessage('Valid Contact number is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long'),

];

exports.validateSigninRequest = [

  check('email')
    .isEmail()
    .withMessage('Email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be atleast 6 characters long'),

];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
