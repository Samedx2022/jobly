const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');  // Adjust the path as necessary

// Create a test payload
const payload = { userId: 123, username: 'testuser' };

try {
  // Sign the token
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  console.log("Signed Token:", token);

  // Verify the token
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log("Decoded Payload:", decoded);
} catch (error) {
  console.error("JWT Error:", error.message);
}
