const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const heroModel = require('../models/hero');

exports.getAll = async (req, res) => {
  try {
    const heroes = await heroModel.getAllHeroes();
    res.json(heroes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const heroes = await heroModel.getHeroById(id);
    if (!heroes || heroes.length === 0) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    res.json(heroes[0]);
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
  const { title, description, link_button } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  try {
    const hero = await heroModel.createHero(
      req.file.filename,
      title,
      description,
      link_button
    );
    res.status(201).json({ ...hero, image_path: `/uploads/${req.file.filename}` });
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
    // Get current hero data
    const heroes = await heroModel.getHeroById(id);
    if (!heroes || heroes.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    const currentHero = heroes[0];

    // Prepare update data - only update provided fields
    const updateData = {
      title: req.body.title || currentHero.title,
      description: req.body.description || currentHero.description,
      link_button: req.body.link_button || currentHero.link_button,
      image_path: req.file ? req.file.filename : currentHero.image_path
    };

    await heroModel.updateHero(id, updateData.image_path, updateData.title, updateData.description, updateData.link_button);
    res.json({ 
      id, 
      image_path: `/uploads/${updateData.image_path}`, 
      title: updateData.title, 
      description: updateData.description, 
      link_button: updateData.link_button 
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
    await heroModel.deleteHero(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 