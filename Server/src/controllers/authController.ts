import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { mockDb } from '../mockDb';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Helper to check if we should use mock DB
const useMockDb = () => process.env.USE_MOCK_DB === 'true';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (useMockDb()) {
      // Check if user exists
      const userExists = await mockDb.findUserByEmail(email);
      if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await mockDb.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          status: user.status,
          joinDate: user.joinDate,
        },
      });
      return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: 'User already exists' });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        status: user.status,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (useMockDb()) {
      // Check for user
      const user = await mockDb.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Check if user is suspended
      if (user.status === 'suspended') {
        res.status(401).json({ success: false, message: 'Account has been suspended' });
        return;
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          status: user.status,
          joinDate: user.joinDate,
        },
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      res.status(401).json({ success: false, message: 'Account has been suspended' });
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        status: user.status,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (useMockDb()) {
      const user = await mockDb.findUserById(userId);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          status: user.status,
          joinDate: user.joinDate,
        },
      });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        status: user.status,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, bio, location, avatar } = req.body;
    const userId = (req as any).user.id;

    if (useMockDb()) {
      const user = await mockDb.updateUser(userId, { name, bio, location, avatar });
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          status: user.status,
          joinDate: user.joinDate,
        },
      });
      return;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, location, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        status: user.status,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
