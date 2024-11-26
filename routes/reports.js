import express from 'express';
var router = express.Router();

/* GET reports listing. */
router.get('/', (req, res, next) => {
  console.log("get them")
  res.send('the get works');
});

/* POST reports listing. */
router.post('/', (req, res, next) => {
  res.send(req.query.title + " " + req.query.location + " " + req.query.description);
});

export default router;
