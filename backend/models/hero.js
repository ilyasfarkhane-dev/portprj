const db = require('./db');

const getAllHeroes = async () => {
  const [rows] = await db.query('SELECT * FROM hero_images');
  return rows;
};

const getHeroById = async (id) => {
  const [rows] = await db.query('SELECT * FROM hero_images WHERE id = ?', [id]);
  return rows;
};

const createHero = async (image_path, title, description, link_button) => {
  const [result] = await db.query(
    'INSERT INTO hero_images (image_path, title, description, link_button) VALUES (?, ?, ?, ?)',
    [image_path, title, description, link_button]
  );
  return { id: result.insertId, image_path, title, description, link_button };
};

const updateHero = async (id, image_path, title, description, link_button) => {
  await db.query(
    'UPDATE hero_images SET image_path=?, title=?, description=?, link_button=? WHERE id=?',
    [image_path, title, description, link_button, id]
  );
};

const deleteHero = async (id) => {
  await db.query('DELETE FROM hero_images WHERE id=?', [id]);
};

module.exports = { getAllHeroes, getHeroById, createHero, updateHero, deleteHero }; 