import { Router } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Demo officer accounts (in production, these would be in a database)
const OFFICER_ACCOUNTS = [
  {
    id: 'officer-user-123',
    email: 'officer@gmail.com',
    password: '12345',
    name: 'Agricultural Officer',
    role: 'officer',
    region: 'Nashik'
  },
  {
    id: 'officer-user-124',
    email: 'officer2@gmail.com',
    password: '12345',
    name: 'Regional Officer',
    role: 'officer',
    region: 'Pune'
  },
  {
    id: 'officer-user-125',
    email: 'officer3@gmail.com',
    password: '12345',
    name: 'District Officer',
    role: 'officer',
    region: 'All Maharashtra'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', status: 400 }
      });
    }

    // Check officer accounts
    const officer = OFFICER_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (officer) {
      const token = jwt.sign(
        { 
          id: officer.id, 
          email: officer.email, 
          role: officer.role,
          name: officer.name,
          region: officer.region
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: officer.id,
          email: officer.email,
          role: officer.role,
          name: officer.name,
          region: officer.region
        }
      });
    }

    // Check farmer accounts in database
    const farmer = await prisma.farmer.findUnique({
      where: { email }
    });

    if (farmer) {
      // For demo, accept the password if it matches the demo pattern
      // In production, use bcrypt.compare
      if (password === '54321') {
        const token = jwt.sign(
          { 
            id: farmer.id, 
            email: farmer.email, 
            role: 'farmer',
            name: farmer.name
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: farmer.id,
            email: farmer.email,
            role: 'farmer',
            name: farmer.name
          }
        });
      }
    }

    return res.status(401).json({
      error: { message: 'Invalid credentials', status: 401 }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { message: 'Login failed', status: 500 }
    });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, location, password, role } = req.body;

    if (!name || !email || !location || !password) {
      return res.status(400).json({
        error: { message: 'Missing required fields', status: 400 }
      });
    }

    // Check if farmer already exists
    const existingFarmer = await prisma.farmer.findUnique({
      where: { email }
    });

    if (existingFarmer) {
      return res.status(409).json({
        error: { message: 'Email already registered', status: 409 }
      });
    }

    // Create new farmer
    const newFarmer = await prisma.farmer.create({
      data: {
        name,
        email,
        phone: phone || null,
        location
      }
    });

    // Generate token
    const token = jwt.sign(
      { 
        id: newFarmer.id, 
        email: newFarmer.email, 
        role: 'farmer',
        name: newFarmer.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newFarmer.id,
        email: newFarmer.email,
        role: 'farmer',
        name: newFarmer.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: { message: 'Registration failed', status: 500 }
    });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  // In a real application, you would invalidate the token
  // For now, we just return success
  res.json({ message: 'Logged out successfully' });
});

router.get('/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: { message: 'No token provided', status: 401 }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    res.json({
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        region: decoded.region
      }
    });
  } catch (error) {
    res.status(401).json({
      error: { message: 'Invalid token', status: 401 }
    });
  }
});

export default router;
