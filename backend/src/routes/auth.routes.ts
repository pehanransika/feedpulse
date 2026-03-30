import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@feedpulse.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ success: false, error: 'Invalid credentials.' });
    return;
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.json({ success: true, data: { token } });
});

export default router;
