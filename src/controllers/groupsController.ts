import express from 'express';
import {
  getGroup, getGroups, addGroup, deleteGroup, updateGroup,
} from '../services/groupsService';
import { groupSchemaOptional, groupSchemaRequired } from '../schemas/group';

// TODO: Handle errors
const router = express.Router();

router.get('/', async (req, res) => {
  const groups = await getGroups();

  res.json({ data: groups });
});

router.get('/:id', async (req, res) => {
  const groupId = req.params.id;

  const group = await getGroup(groupId);

  if (!group) {
    res.json({ message: `Group with ${groupId} id was not found.` });
    return;
  }

  res.json({ data: group });
});

router.post('/', async (req, res) => {
  const { value, error } = groupSchemaRequired.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: 'Invalid data provided', errors: error.details, data: value });
    return;
  }

  const newGroup = await addGroup(req.body);

  res.json({ message: 'Group created successfully', data: newGroup });
});

router.put('/:id', async (req, res) => {
  const groupId = req.params.id;
  const payload = req.body;

  const { value, error } = groupSchemaOptional.validate(payload, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: 'Invalid data provided', errors: error.details, data: value });
    return;
  }

  const updatedUser = await updateGroup(groupId, payload);

  if (!updatedUser) {
    res.status(400).json({ message: `User with ${groupId} id was not found.` });
    return;
  }

  res.json({ data: updatedUser });
});

router.delete('/:id', async (req, res) => {
  const groupId = req.params.id;

  const deletedCount = await deleteGroup(groupId);

  if (deletedCount === 0) {
    res.status(400).json({ message: `User with ${groupId} id was not found.` });
  }

  res.json({ message: `User with ${groupId} id was deleted.` });
});

export default router;
