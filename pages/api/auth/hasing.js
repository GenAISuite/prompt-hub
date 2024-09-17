const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds

// Generate a salt
const salt = '$2b$10$abcdefghijklmnopqrstuv'

const hashPassword = async (password) => {
    try {
      return await bcrypt.hash(password, salt);
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  };

export default hashPassword;