const jwt = require('jsonwebtoken');
const generateToken = require('../../src/utils/generateToken');

describe('Token generation', () => {
  it('should generate a valid JWT containing id and role', () => {
    const user = { id: 1, role: 'user' };
    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.id).toBe(1);
    expect(decoded.role).toBe('user');
  });
});
