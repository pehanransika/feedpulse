import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;
    if (!title || !description || !category) {
      res.status(400).json({ success: false, error: 'Title, description, and category are required.' });
      return;
    }
    const feedback = await Feedback.create({ title, description, category, submitterName, submitterEmail });
    res.status(201).json({ success: true, data: feedback, message: 'Feedback submitted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Feedback.countDocuments(filter);
    const items = await Feedback.find(filter).sort(sort as string).skip(skip).limit(Number(limit));

    res.json({ success: true, data: items, message: `${total} items found.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getFeedbackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Feedback.findById(req.params.id);
    if (!item) { res.status(404).json({ success: false, error: 'Not found.' }); return; }
    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { res.status(404).json({ success: false, error: 'Not found.' }); return; }
    res.json({ success: true, data: item, message: 'Updated.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Feedback.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ success: false, error: 'Not found.' }); return; }
    res.json({ success: true, message: 'Deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};