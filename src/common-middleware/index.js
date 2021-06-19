const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const shortid = require('shortid');
require('dotenv').config();

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketname = process.env.AWS_BUCKET_NAME;

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
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};

exports.pharmacyMiddleware = (req, res, next) => {
  if (req.user.role !== 'pharmacy') {
    return res.status(400).json({ message: 'Access Denied' });
  }
  next();
};
