const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const multimediaModel = require('../models/multimedia');

exports.getAll = async (req, res) => {
  try {
    const multimedia = await multimediaModel.getAllMultimedia();
    res.json(multimedia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const multimedia = await multimediaModel.getMultimediaById(id);
    if (!multimedia || multimedia.length === 0) {
      return res.status(404).json({ message: 'Multimedia not found' });
    }
    res.json(multimedia[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title } = req.body;
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  
  try {
    // Determine file type based on mimetype
    let fileType = 'image';
    if (req.file.mimetype.startsWith('video/')) {
      fileType = 'video';
    }
    
    const multimedia = await multimediaModel.createMultimedia(
      title,
      req.file.filename,
      fileType
    );
    res.status(201).json({ ...multimedia, file_path: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  
  try {
    // Get current multimedia data
    const multimedia = await multimediaModel.getMultimediaById(id);
    if (!multimedia || multimedia.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Multimedia not found' });
    }
    
    const currentMultimedia = multimedia[0];

    // Prepare update data
    const updateData = {
      title: req.body.title || currentMultimedia.title,
      file_path: req.file ? req.file.filename : currentMultimedia.file_path,
      file_type: req.file ? (req.file.mimetype.startsWith('video/') ? 'video' : 'image') : currentMultimedia.file_type
    };

    await multimediaModel.updateMultimedia(id, updateData.title, updateData.file_path, updateData.file_type);
    res.json({ 
      id, 
      file_path: `/uploads/${updateData.file_path}`, 
      title: updateData.title,
      file_type: updateData.file_type
    });
  } catch (err) {
    console.error(err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await multimediaModel.deleteMultimedia(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 