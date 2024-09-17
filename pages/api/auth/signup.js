// pages/api/auth/signup.js
import pool from '../../../lib/db';
import hashPassword from './hasing';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    console.log(req.body);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Check if user already exists
      const existingUserQuery = 'SELECT * FROM prompt_user WHERE email = $1';
      const existingUserResult = await pool.query(existingUserQuery, [email]);

      if (existingUserResult.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const createUserQuery = 'INSERT INTO prompt_user (name, email, password) VALUES ($1, $2, $3) RETURNING *';
      const newUserResult = await pool.query(createUserQuery, [name, email, hashedPassword]);

      return res.status(201).json(newUserResult.rows[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}