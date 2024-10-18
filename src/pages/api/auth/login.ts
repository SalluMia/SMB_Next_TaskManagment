// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';  // Change to bcryptjs for consistency
import jwt from 'jsonwebtoken';
import connectDB from '../../../utils/db';
import User from '../../../models/User';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Check if the user exists in the database
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h', // Adjust as per your requirement
      });

      // Send the token and user information (excluding the password)
      const { password: userPassword, ...userWithoutPassword } = user.toObject();  // Remove the password field from the response

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });

    } catch (error) {
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default login;
