const db = require('./db');

const getAllHistoires = async () => {
  const [rows] = await db.query('SELECT * FROM histoire_images');
  return rows;
};

const getHistoireById = async (id) => {
  const [rows] = await db.query('SELECT * FROM histoire_images WHERE id = ?', [id]);
  return rows;
};

const createHistoire = async (images, title, description, periode) => {
  const values = images.map(img => [img, title, description, periode]);
  const [result] = await db.query(
    'INSERT INTO histoire_images (image_path, title, description, periode) VALUES ?',
    [values]
  );
  return result;
};

const updateHistoire = async (id, title, description, periode) => {
  await db.query(
    'UPDATE histoire_images SET title=?, description=?, periode=? WHERE id=?',
    [title, description, periode, id]
  );
};

const deleteHistoire = async (id) => {
  await db.query('DELETE FROM histoire_images WHERE id=?', [id]);
};

module.exports = { getAllHistoires, getHistoireById, createHistoire, updateHistoire, deleteHistoire }; 