const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const mediaModel = require('../models/media');

exports.getAll = async (req, res) => {
  try {
    const medias = await mediaModel.getAllMedias();
    res.json(medias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const medias = await mediaModel.getMediaById(id);
    if (!medias || medias.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.json(medias[0]);
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
  const { title, description, periode } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  try {
    const media = await mediaModel.createMedia(
      req.file.filename,
      title,
      description,
      periode
    );
    res.status(201).json({ ...media, image_path: req.file.filename });
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
    // Get current media data
    const medias = await mediaModel.getMediaById(id);
    if (!medias || medias.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Media not found' });
    }
    
    const currentMedia = medias[0];

    // Prepare update data - only update provided fields
    const updateData = {
      title: req.body.title || currentMedia.title,
      description: req.body.description || currentMedia.description,
      periode: req.body.periode || currentMedia.periode,
      image_path: req.file ? req.file.filename : currentMedia.image_path
    };

    await mediaModel.updateMedia(id, updateData.image_path, updateData.title, updateData.description, updateData.periode);
    res.json({ 
      id, 
      image_path: updateData.image_path, 
      title: updateData.title, 
      description: updateData.description, 
      periode: updateData.periode 
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
    await mediaModel.deleteMedia(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 