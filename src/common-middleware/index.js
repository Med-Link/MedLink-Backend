const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const shortid = require('shortid');
require('dotenv').config();

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketname = process.env.AWS_BUCKET_NAME;
const bucketname1 = process.env.AWS_BUCKET_NAME1;

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
});

exports.upload = multer();

exports.uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: bucketname,
    // acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
    },
  }),
});

exports.uploadpS3 = multer({
  storage: multerS3({
    s3,
    bucket: bucketname1,
    // acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
    },
  }),
});

// eslint-disable-next-line consistent-return
exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: 'Authorization required' });
  }
  next();

  // jwt.decode()
};
// eslint-disable-next-line consistent-return
exports.adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const userrole = decoded.payload.role;
  // console.log(customerrole);
  if (userrole !== 'admin') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

// eslint-disable-next-line consistent-return
exports.customerMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerrole = decoded.payload.role;
  // console.log(customerrole);
  if (customerrole !== 'customer') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

// eslint-disable-next-line consistent-return
exports.pharmacyMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const userrole = decoded.payload.role;
  // console.log(customerrole);
  if (userrole !== 'pharmacy') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};
