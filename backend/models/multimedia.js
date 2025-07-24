const db = require('./db');

const getAllMultimedia = async () => {
  const [rows] = await db.query('SELECT * FROM multimedia ORDER BY created_at DESC');
  return rows;
};

const getMultimediaById = async (id) => {
  const [rows] = await db.query('SELECT * FROM multimedia WHERE id = ?', [id]);
  return rows;
};

const createMultimedia = async (title, file_path, file_type) => {
  const [result] = await db.query(
    'INSERT INTO multimedia (title, file_path, file_type) VALUES (?, ?, ?)',
    [title, file_path, file_type]
  );
  return { id: result.insertId, title, file_path, file_type };
};
 
const updateMultimedia = async (id, title, file_path, file_type) => {
  await db.query(
    'UPDATE multimedia SET title=?, file_path=?, file_type=? WHERE id=?',
    [title, file_path, file_type, id]
  );
};

const deleteMultimedia = async (id) => {
  await db.query('DELETE FROM multimedia WHERE id=?', [id]);
};

module.exports = { 
  getAllMultimedia, 
  getMultimediaById, 
  createMultimedia, 
  updateMultimedia, 
  deleteMultimedia 
}; 