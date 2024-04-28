import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { NoTokenError, InvalidTokenError } from '../exceptions/GeneralException.js';
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const authMiddleware = ( req, res, next) => {
	// console.log('middle')

	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		throw new NoTokenError();
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		throw new InvalidTokenError();
	}
};