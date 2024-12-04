import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const username = req.query.user;
    if (!username) {
      return res.status(400).json({ status: 'error', error: 'Username is required'})
    }

    const user = await req.models.Users.findOne({ username: username});

    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found'})
    }

    res.status(200).json({
      username: user.username,
      biography: user.biography,
      accountCreation: user.accountCreation,
      crimesReported: user.crimesReported
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: error.message})
  }
});

export default router;
