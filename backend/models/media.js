const db = require('./db');

const getAllMedias = async () => {
  const [rows] = await db.query('SELECT * FROM actualites');
  return rows;
};

const getMediaById = async (id) => {
  const [rows] = await db.query('SELECT * FROM actualites WHERE id = ?', [id]);
  return rows;
};

const createMedia = async (image_path, title, description, periode) => {
  const [result] = await db.query(
    'INSERT INTO actualites (image_path, title, description, periode) VALUES (?, ?, ?, ?)',
    [image_path, title, description, periode]
  );
  return { id: result.insertId, image_path, title, description, periode };
};

const updateMedia = async (id, image_path, title, description, periode) => {
  await db.query(
    'UPDATE actualites SET image_path=?, title=?, description=?, periode=? WHERE id=?',
    [image_path, title, description, periode, id]
  );
};

const deleteMedia = async (id) => {
  await db.query('DELETE FROM actualites WHERE id=?', [id]);
};

module.exports = { getAllMedias, getMediaById, createMedia, updateMedia, deleteMedia }; 