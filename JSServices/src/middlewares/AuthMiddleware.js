import jwt from 'jsonwebtoken';
import 'dotenv/config'

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const authMiddleware = ( req, res, next) => {
	console.log('middle')

	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).send('Authentication token missing.');
	}

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		console.log(error)
		return res.status(403).send('Invalid or expired token.');
	}
};