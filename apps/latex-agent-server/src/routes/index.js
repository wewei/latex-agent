const express = require('express');
const router = express.Router();

// Import specific route modules
const documentRoutes = require('./document.routes');
const compilationRoutes = require('./compilation.routes');
const healthRoutes = require('./health.routes');

// Register route modules
router.use('/documents', documentRoutes);
router.use('/compile', compilationRoutes);
router.use('/health', healthRoutes);

// API root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'LaTeX Agent API v1',
    endpoints: [
      '/documents',
      '/compile',
      '/health'
    ]
  });
});

module.exports = router; 