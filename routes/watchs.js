import express from 'express';
const router = express.Router();

router.get('/time', async (req, res) => {
  console.log("Running the GET WATCH method");
  try {
      if (req.session.isAuthenticated) {
          // User is logged in, return only their watches
          const username = req.session.account.username;
          console.log("Fetching watch times for:", username);

          const userWatches = await req.models.Watchs.find({ username });
          const watchTimes = userWatches.map(watch => ({
              description: watch.description,
              location: watch.location,
              watch_date: watch.watch_date,
              time_start: watch.time_start,
              time_end: watch.time_end,
          }));

          res.json(watchTimes);
      } else {
          // User is not logged in, return all watches with usernames
          console.log("Fetching all watches for unauthenticated user.");

          const allWatches = await req.models.Watchs.find();
          const watchTimes = allWatches.map(watch => ({
              username: watch.username,
              description: watch.description,
              location: watch.location,
              watch_date: watch.watch_date,
              time_start: watch.time_start,
              time_end: watch.time_end,
          }));

          res.json(watchTimes);
      }
  } catch (err) {
      console.error("Error fetching watch times:", err);
      res.status(500).json({ status: "error", error: err.message });
  }
});

// POST /watch/signup - Allows users to indicate a time they are interested in joining a neighborhood watch
router.post('/signup', async (req, res) => {
    try {
        if (!req.session.isAuthenticated) {
            return res.status(401).json({ status: "error", error: "User not logged in" });
        }

        const { description, location, watch_date, time_start, time_end } = req.body;

        if (!description || !location || !watch_date || !time_start || !time_end) {
            return res.status(400).json({ status: "error", error: "Missing required fields" });
        }

        const username = req.session.account.username;

        const newWatch = new req.models.Watchs({
            username,
            description,
            location,
            watch_date,
            time_start,
            time_end,
        });

        await newWatch.save();
        res.json({ status: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

export default router;