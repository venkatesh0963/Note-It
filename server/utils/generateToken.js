import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'noteit_super_secret_jwt_key_2026_xyz987', {
    expiresIn: '30d',
  });
};

export default generateToken;
