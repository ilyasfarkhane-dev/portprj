const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const histoireModel = require('../models/histoire');

exports.getAll = async (req, res) => {
  try {
    const histoires = await histoireModel.getAllHistoires();
    res.json(histoires);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const histoires = await histoireModel.getHistoireById(id);
    if (!histoires || histoires.length === 0) {
      return res.status(404).json({ message: 'Histoire not found' });
    }
    res.json(histoires[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, periode } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'At least one image is required' });
  try {
    const images = req.files.map(f => f.filename);
    await histoireModel.createHistoire(images, title, description, periode);
    res.status(201).json({ images: images.map(img => `/uploads/${img}`), title, description, periode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  
  try {
    // Get current histoire data
    const histoires = await histoireModel.getHistoireById(id);
    if (!histoires || histoires.length === 0) {
      if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
      return res.status(404).json({ message: 'Histoire not found' });
    }
    
    const currentHistoire = histoires[0];

    // Prepare update data - only update provided fields
    const updateData = {
      title: req.body.title || currentHistoire.title,
      description: req.body.description || currentHistoire.description,
      periode: req.body.periode || currentHistoire.periode
    };

    // If new images are uploaded, replace the old ones
    if (req.files && req.files.length > 0) {
      // Delete old images from database
      await histoireModel.deleteHistoire(id);
      
      // Create new histoire entries with new images
      const images = req.files.map(f => f.filename);
      await histoireModel.createHistoire(images, updateData.title, updateData.description, updateData.periode);
      
      res.json({ 
        id, 
        images: images.map(img => `/uploads/${img}`),
        title: updateData.title, 
        description: updateData.description, 
        periode: updateData.periode 
      });
    } else {
      // Update only text fields
      await histoireModel.updateHistoire(id, updateData.title, updateData.description, updateData.periode);
      res.json({ 
        id, 
        title: updateData.title, 
        description: updateData.description, 
        periode: updateData.periode 
      });
    }
  } catch (err) {
    console.error(err);
    if (req.files) req.files.forEach(f => fs.unlinkSync(f.path));
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await histoireModel.deleteHistoire(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 