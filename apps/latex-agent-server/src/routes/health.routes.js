const express = require('express');
const router = express.Router();

/**
 * @route GET /latex/api/v1/health
 * @desc Check API health status
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 