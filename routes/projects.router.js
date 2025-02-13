import {Router} from 'express'
import {body} from 'express-validator'; 
import { addUserToProject, createProject, getAllProject, getProjectByIdController, updateFileTree } from '../controllers/project.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create',
  authUser,
  body('name').isString().withMessage('Name is required'), createProject
 )

 router.get('/all', authUser,getAllProject )
router.put('/add-user', 
  authUser, 
  body('projectId').isString().withMessage('Project ID is required'),
  body('users').isArray({ min: 1 }).withMessage('Users is required and should be an array of strings').custom((users) => {
    return users.every(user => typeof user === 'string');
  }).withMessage('Each user should be a string'), 
  addUserToProject
)

router.get('/get-project/:projectId', authUser, getProjectByIdController);

router.put('/update-file-tree',
  authUser,
  body('projectId').isString().withMessage('Project ID is required'),
  body('fileTree').isObject().withMessage('File tree is required'),
  updateFileTree
)



 export default router;
