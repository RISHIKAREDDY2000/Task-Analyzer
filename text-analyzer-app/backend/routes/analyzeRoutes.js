const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, isEditor, isReaderOrEditor } = require('../middleware/auth');

const dataPath = path.join(__dirname, '../data/data.json');

// Helper functions
const loadData = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Mock summarization function (you can integrate OpenAI API here)
const summarizeText = (text) => {
  // Simple mock: return first 50 characters + "..."
  if (text.length <= 50) return text;
  return text.substring(0, 50) + '...';
};

// GET /api/analyze - Get all text records (Reader & Editor)
router.get('/analyze', verifyToken, isReaderOrEditor, (req, res) => {
  const data = loadData();
  res.status(200).json({
    records: data.textRecords
  });
});

// POST /api/analyze - Create new analysis (Editor only)
router.post('/analyze', verifyToken, isEditor, (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Text is required' });
  }

  const data = loadData();
  
  // Generate new ID
  const newId = data.textRecords.length > 0 
    ? Math.max(...data.textRecords.map(r => r.id)) + 1 
    : 1;

  const newRecord = {
    id: newId,
    originalText: text,
    summarizedText: summarizeText(text),
    createdBy: req.username,
    createdAt: new Date().toISOString()
  };

  data.textRecords.push(newRecord);
  saveData(data);

  res.status(201).json({
    message: 'Text analyzed successfully',
    record: newRecord
  });
});

// PUT /api/analyze/:id - Update record (Editor only)
router.put('/analyze/:id', verifyToken, isEditor, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Text is required' });
  }

  const data = loadData();
  const recordIndex = data.textRecords.findIndex(r => r.id === parseInt(id));

  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  data.textRecords[recordIndex].originalText = text;
  data.textRecords[recordIndex].summarizedText = summarizeText(text);
  data.textRecords[recordIndex].updatedAt = new Date().toISOString();
  data.textRecords[recordIndex].updatedBy = req.username;

  saveData(data);

  res.status(200).json({
    message: 'Record updated successfully',
    record: data.textRecords[recordIndex]
  });
});

// DELETE /api/analyze/:id - Delete record (Editor only)
router.delete('/analyze/:id', verifyToken, isEditor, (req, res) => {
  const { id } = req.params;

  const data = loadData();
  const recordIndex = data.textRecords.findIndex(r => r.id === parseInt(id));

  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  const deletedRecord = data.textRecords.splice(recordIndex, 1);
  saveData(data);

  res.status(200).json({
    message: 'Record deleted successfully',
    record: deletedRecord[0]
  });
});

module.exports = router;