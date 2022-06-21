import express from 'express';
import {
  getGroup, getGroups, addGroup, deleteGroup, updateGroup, addUsersToGroup,
} from '../services/groups.service';
import { groupSchemaOptional, groupSchemaRequired } from '../schemas/group';
import { validationMiddleware } from '../middleware/validation.middleware';

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

router.post('/', validationMiddleware(groupSchemaRequired), async (req, res) => {
  const newGroup = await addGroup(req.body);

  res.json({ message: 'Group created successfully', data: newGroup });
});

router.put('/:id', validationMiddleware(groupSchemaOptional), async (req, res) => {
  const groupId = req.params.id;
  const payload = req.body;

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

router.post(
  '/addUsersToGroup',
  async (req, res) => {
    const payload = req.body;

    if (payload.groupId && payload.userIds) {
      const { groupId, userIds } = payload;

      const { result, error } = await addUsersToGroup(groupId, userIds);

      if (error) {
        return res.status(400).json({
          message: 'Error happened, Verify if all records with provided ids exist.',
        });
      }

      if (result) {
        return res.json({ message: `All users from array were added to group with ${groupId} id.` });
      }
    }

    res.status(400).json({ message: 'You must provide groupId and userIds.' });
  },
);

export default router;