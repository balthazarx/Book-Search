import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
    try {
        const secretKey = process.env.JWT_SECRET_KEY || '';
        const user = jwt.verify(token, secretKey);
        return user;
    }
    catch (err) {
        throw new Error('Invalid token');
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign(payload, secretKey, { expiresIn: '2h' });
};
