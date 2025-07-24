const db = require('./db');

const findUserByEmailAndPassword = async (email, password) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  return rows[0];
};

module.exports = { findUserByEmailAndPassword }; 