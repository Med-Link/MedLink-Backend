
const {check, validationResult} = require('express-validator');


exports.validateRequest = [
      check('firstName')
      .notEmpty()
      .withMessage('firstName is required'),
      check('lastName')
      .notEmpty()
      .withMessage('lastName is required'),
      check('email')
      .isEmail()
      .withMessage('valid Email is required'),
      check('password')
      .isLength({min:6})
      .withMessage('password must be atleast 6 characters long'),
      
];

exports.isRequestValidated = (req, res, next) => {
      const errors = validationResult(req);
      if(errors.array().length>0){
            return res.status(400).json({ error: errors.array()[0].msg })
      }
}