// pages/api/auth/signin.js
import pool from '../../../lib/db'; // Assuming you have a db.js file for database connection
import hashPassword from './hasing';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Check if user exists
      const hashedPassword = await hashPassword(password);
      console.log('hasPassword', hashedPassword);
      const query = 'SELECT * FROM prompt_user WHERE email = $1 AND password = $2';
      const values = [email, hashedPassword];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = result.rows[0];
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to sign in' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}