import pool from '../../../lib/db'; // Assuming you have a db.js file for database connection
import hashPassword from './hasing';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email,oldPassword, newPassword } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      
      // Check if user exists
      const query = 'SELECT * FROM prompt_user WHERE email = $1';
      const values = [email];
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email' });
      }

      const hasedOldPassword = await hashPassword(oldPassword);
      const hasedNewPassword = await hashPassword(newPassword);

      if (hasedOldPassword !== result.rows[0].password) {
        return res.status(401).json({ message: 'Invalid old password' });
      }

      // Implement password reset logic here
      
      const updatequery = 'UPDATE prompt_user SET password = $1 WHERE email = $2';
      const updatevalues = [hasedNewPassword, email];
      const updateres = await pool.query(updatequery, updatevalues);
      console.log('updateres', updateres.rowCount);
      // if (updateres.rows.length === 0) {
      //   return res.status(401).json({ message: 'Failed to reset password' });
      // }
      return res.status(200).json({ message: 'Password updated!' });
    } catch (err) {
      console.error('Error resetting password:',err);
      return res.status(500).json({ message: 'Failed to reset password' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
