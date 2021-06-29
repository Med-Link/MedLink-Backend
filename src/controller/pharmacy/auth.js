const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { LexRuntime } = require('aws-sdk');
const User = require('../../models/user');
const pool = require('../../db/db');

exports.signup = async (req, res) => {
  // User.findOne({ email: req.body.email }).exec((error, userdet) => {
  const {
    email, name, contactNumber, password,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.pharmacy WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('pharmacy already exist!');
    }
    let regDocs = [];

    if (req.files.length > 0) {
      regDocs = req.files.map((file) => ({ img: file.location }));
    }

    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);
    const activeStatus = 0;
    let names = [];
    names = regDocs.map((item) => item.img);

    const newUser = await pool.query(
      'INSERT INTO public.pharmacy ( email, name, contactnumber, activestatus, document1, document2, document3, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [email, name, contactNumber, activeStatus, names[0], names[1], names[2], bcryptPassword],
    );
    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    if (newUser) {
      return res.status(201).json({
        message: 'pharmacy created success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.signup = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (userdet) {
//       return res.status(400).json({
//         message: 'Pharmacy already registered',
//       });
//     }
//     const {
//       firstName, lastName, email, contactNumber, password,
//     } = req.body;

//     var registrationDocs = [];

//     if (req.files.length > 0) {
//       registrationDocs = req.files.map((file) => {
//         return { img:file.location };
//       });
//     }
// // console.log(registrationDocs);

//     // eslint-disable-next-line no-underscore-dangle
//     const _user = new User({
//       firstName,
//       lastName,
//       email,
//       contactNumber,
//       activeStatus: 0,
//       registrationDocs,
//       password,
//       userName: Math.random().toString(),
//       role: 'pharmacy',
//     });
//     _user.save(( error, userdet ) => {
//       if (error) {
//         return res.status(400).json({
//           message: error,
//         });
//       }
//       if (userdet) {
//         return res.status(201).json({
//           message: 'Pharmacy created success',
//         });
//       }
//     });
//   });
// };


exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.pharmacy WHERE email = $1', [
      email,
    ]);
    // const role = customer;
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password,
    );

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }
    const payload = { id: user.rows[0].pharmacyid };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { noTimestamp: true, expiresIn: '6h' });
    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.signin = (req, res) => {
//   User.findOne({ email: req.body.email }).exec((error, userdet) => {
//     if (error) return res.status(400).json({ error });
//     if (userdet) {
//       if (userdet.authenticate(req.body.password) && userdet.role === 'pharmacy') {
//         const token = jwt.sign({ _id: userdet._id, role: user.role }, process.env.JWT_SECRET, {
//           expiresIn: '6h',
//         });
//         const {
//           _id, firstName, lastName, email, contactNumber, role, fullName,
//         } = userdet;
//         res.status(200).json({
//           token,
//           userdet: {
//             _id,
//             firstName,
//             lastName,
//             email,
//             contactNumber,
//             role,
//             fullName,
//           },
//         });
//       } else {
//         return res.status(400).json({
//           message: 'invalid password',
//         });
//       }
//     } else {
//       return res.status(400).json({ message: 'something went wrong' });
//     }
//   });
// };
