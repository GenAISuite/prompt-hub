import { v4 as uuidv4 } from 'uuid';
import pool from '../../../lib/db'; // Assuming you have a db.js file for database connection

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM prompt WHERE id = $1',
        [id]
      );
      const prompt = result.rows[0];
      if (prompt) {
        const userResult = await pool.query(
          'SELECT * FROM prompt_user WHERE id in ($1)',
          [prompt.edit_access.join(',')]
        );
        var maduserMeta = {};
        userResult.rows.map(user => maduserMeta[user.id] = user);
        prompt.userMeta = maduserMeta; // Add user metadata to prompt
        res.status(200).json(prompt);
      } else {
        res.status(404).json({ message: 'Prompt not found' });
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
      res.status(500).json({ message: 'Failed to fetch prompt' });
    }
  } else if (req.method === 'PUT') {
    const { name, prompt: newPrompt, updated_by, edit_access } = req.body;
    try {
      const result = await pool.query(
        'UPDATE prompt SET name = $1, prompt = $2, updated_by = $3, edit_access = $4 WHERE id = $5 RETURNING *',
        [name, newPrompt, updated_by, edit_access, id]
      );
      const updatedPrompt = result.rows[0];
      res.status(200).json(updatedPrompt);
    } catch (error) {
      console.error('Error updating prompt:', error);
      res.status(500).json({ message: 'Failed to update prompt' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await pool.query(
        'DELETE FROM prompt WHERE id = $1',
        [id]
      );
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      res.status(500).json({ message: 'Failed to delete prompt' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}