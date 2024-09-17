import pool from '../../../lib/db'; // Assuming you have a db.js file for database connection


async function createUser(name, email, password) {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password] // You may want to hash the password in production
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
}

async function search(query) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE name ILIKE $1', [`%${query}%`]);
    return result.rows;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Could not search users');
  }
  
}

async function getAllUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Could not fetch users');
  }
}

async function updateUser(id, name, email, password) {
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, id] // You may want to hash the password in production
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user');
  }
}

async function deleteUser(id) {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return `User with id ${id} deleted`;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Could not delete user');
  }
}

export { createUser, search, getAllUsers, updateUser, deleteUser };