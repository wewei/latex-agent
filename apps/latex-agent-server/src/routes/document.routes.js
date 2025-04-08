const express = require('express');
const router = express.Router();

/**
 * @route GET /latex/api/v1/documents
 * @desc Get all documents
 * @access Public
 */
router.get('/', (req, res) => {
  // This would typically interact with a controller
  res.json({ message: 'Get all documents' });
});

/**
 * @route GET /latex/api/v1/documents/:id
 * @desc Get document by ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  res.json({ message: `Get document with ID: ${req.params.id}` });
});

/**
 * @route POST /latex/api/v1/documents
 * @desc Create a new document
 * @access Public
 */
router.post('/', (req, res) => {
  res.status(201).json({ 
    message: 'Document created',
    document: req.body
  });
});

/**
 * @route PUT /latex/api/v1/documents/:id
 * @desc Update document by ID
 * @access Public
 */
router.put('/:id', (req, res) => {
  res.json({ 
    message: `Update document with ID: ${req.params.id}`,
    document: req.body
  });
});

/**
 * @route DELETE /latex/api/v1/documents/:id
 * @desc Delete document by ID
 * @access Public
 */
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete document with ID: ${req.params.id}` });
});

module.exports = router; 