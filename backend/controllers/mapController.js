const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const mapModel = require('../models/map');

exports.get = async (req, res) => {
  try {
    const map = await mapModel.getMap();
    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  try {
    const map = await mapModel.createMap(req.file.filename);
    res.status(201).json({ ...map, image_path: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ message: 'Image is required' });
  try {
    await mapModel.updateMap(id, req.file.filename);
    res.json({ id, image_path: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await mapModel.deleteMap(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 