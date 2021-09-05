// const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.allpharmacies = async (req, res) => {
  try {
    const allpharmacieslist = await pool.query(
      'SELECT * FROM public.pharmacy  WHERE pharmacy.activestatus=true',
    );
    const result = allpharmacieslist.rows;

    if (allpharmacieslist) {
      return res.status(201).json({
        message: 'pharmacies listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.searchpharmacy = async (req, res) => {
  const {
    typetext,
  } = req.body;
  try {
    const searchmedicine = await pool.query(
      'SELECT * FROM public.medicines WHERE medicines.medname LIKE $1',
      [`${typetext}%`],
    );
    const result = searchmedicine.rows;
    // console.log(searchmedicine);
    if (searchmedicine) {
      return res.status(201).json({
        message: 'pharmacies listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.pharmacybylocation = async (req, res) => {
  const {
    latitude, longitude,
  } = req.body;
  try {
    const searchpharmacy = await pool.query(
      `SELECT * FROM (
          SELECT *, 
              (
                  (
                      (
                          acos(
                              sin(( ${latitude} * pi() / 180))
                              *
                              sin(( latitude * pi() / 180)) + cos(( ${latitude} * pi() /180 ))
                              *
                              cos(( latitude * pi() / 180)) * cos((( ${longitude} - longitude) * pi()/180)))
                      ) * 180/pi()
                  ) * 60 * 1.1515 * 1.609344
              )
          as distance FROM public.pharmacy
      ) pharmacy
      WHERE distance <= 500
      LIMIT 15;`,
    );
    const result = searchpharmacy.rows;
    if (searchpharmacy) {
      return res.status(200).json({
        message: 'pharmacies listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.searchmedicine = async (req, res) => {
  const {
    typetext,
  } = req.body;
  try {
    const searchmedicine = await pool.query(
      'SELECT * FROM public.medicines WHERE medicines.medname LIKE $1',
      [`${typetext}%`],
    );
    const result = searchmedicine.rows;
    // console.log(searchmedicine);
    if (searchmedicine) {
      return res.status(200).json({
        message: 'pharmacies listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.pharmacybymedicine = async (req, res) => {
  const {
    medname,
  } = req.body;
  try {
    const searchpharmacy = await pool.query(
      'SELECT pharmacy.pharmacyid FROM public.pharmacy INNER JOIN public.medicinebatch ON pharmacy.pharmacyid = medicinebatch.pharmacyid INNER JOIN medicines ON medicinebatch.medid = medicines.medid WHERE medicines.medname = $1',
      [medname],
    );
    const result = searchpharmacy.fields;
    // console.log(searchpharmacy);
    if (searchpharmacy) {
      return res.status(200).json({
        message: 'pharmacies listed success',
        result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
