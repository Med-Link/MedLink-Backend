const bcrypt = require('bcrypt');
const pool = require('../../db/db');

exports.addnewAdmin = async (req, res) => {
  const {
    email, firstName, lastName, password,
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM public.admin WHERE email = $1', [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json('admin already exist!');
    }
    const activestatus = 0;
    // const salt = bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hashSync(password, 10);

    const newUser = await pool.query(
      'INSERT INTO public.admin ( email, firstname, lastname, activestatus, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, firstName, lastName, activestatus, bcryptPassword],
    );

    // const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    if (newUser) {
      return res.status(201).json({
        message: 'admin created success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
