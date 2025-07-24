const db = require('./db');

const getMap = async () => {
  const [rows] = await db.query('SELECT * FROM map_images LIMIT 1');
  return rows[0];
};

const createMap = async (image_path) => {
  await db.query('DELETE FROM map_images'); // Only one allowed
  const [result] = await db.query('INSERT INTO map_images (image_path) VALUES (?)', [image_path]);
  return { id: result.insertId, image_path };
};

const updateMap = async (id, image_path) => {
  await db.query('UPDATE map_images SET image_path=? WHERE id=?', [image_path, id]);
};

const deleteMap = async (id) => {
  await db.query('DELETE FROM map_images WHERE id=?', [id]);
};

module.exports = { getMap, createMap, updateMap, deleteMap }; 