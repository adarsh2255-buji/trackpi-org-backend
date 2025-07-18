import express from 'express';
import {
  createSection,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  getAllSections
} from '../controllers/sectionController.js';
import { requireAdminAuth } from '../controllers/adminController.js';

const router = express.Router();

// Create a new section
router.post('/', requireAdminAuth, createSection);
// Get a section by ID
router.get('/:id', requireAdminAuth, getSectionById);
// Update a section by ID
router.put('/:id', requireAdminAuth, updateSectionById);
// Delete a section by ID
router.delete('/:id', requireAdminAuth, deleteSectionById);
// Get all sections
router.get('/', requireAdminAuth, getAllSections);

export default router; 