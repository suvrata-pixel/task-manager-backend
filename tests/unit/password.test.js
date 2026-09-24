const bcrypt = require('bcryptjs');

describe('Password hashing', () => {
  it('should hash a password and not equal the original', async () => {
    const password = 'secret123';
    const hashed = await bcrypt.hash(password, 10);
    expect(hashed).not.toBe(password);
  });

  it('should correctly compare a matching password', async () => {
    const password = 'secret123';
    const hashed = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hashed);
    expect(isMatch).toBe(true);
  });

  it('should fail comparison for a wrong password', async () => {
    const password = 'secret123';
    const hashed = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare('wrongPassword', hashed);
    expect(isMatch).toBe(false);
  });
});
