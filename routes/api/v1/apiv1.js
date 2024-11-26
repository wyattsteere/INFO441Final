import express from 'express';
var router = express.Router();

import usersRouter from './users/myidentity.js';

router.use('/users', usersRouter)
export default router;