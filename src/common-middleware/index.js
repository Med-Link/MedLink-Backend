/* eslint-disable consistent-return */
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
    acl: 'public-read',
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
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
    },
  }),
});

exports.requireSignin = (req, res, next) => {
  // console.log(req.cookies);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: 'Authorization required' });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const { role } = decoded.payload;
  if (role !== 'admin') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

exports.customerMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const { role } = decoded.payload;
  if (role !== 'customer') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

exports.pharmacyMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const { role } = decoded.payload;
  if (role !== 'pharmacy') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};
