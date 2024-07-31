
const express = require('express');
const router = express.Router();


const ADMIN_CREDENTIALS = {
  username: 'cepoonjar@admin',
  password: 'cepAdmin_2024' 
};

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
