import express from 'express';
const router = express.Router();

// GET /watch/time - Allows users to see the times for which they have signed up
router.get('/time', async (req, res) => {
  console.log("Running the GET WATCH method");
  try {
    // Check if user is authenticated
    if (!req.session.isAuthenticated) {
      console.log("User not logged in");
      return res.status(401).json({ status: "error", error: "User not logged in" });
    }

    // Get username from session
    const username = req.session.account.username;
    console.log("Fetching watch times for:", username);

    // Fetch watch times from database
    const userWatches = await req.models.Watchs.find({ username });

    // const userWatches = await req.models.Watchs.find();

    // Transform watch times into a formatted response
    const watchTimes = await Promise.all(
      userWatches.map(async watch => ({
        id: watch._id,
        description: watch.description,
        location: watch.location,
        watch_date: watch.watch_date,
        time_start: watch.time_start,
        time_end: watch.time_end,
      }))
    );

    // Send the formatted response
    res.json(watchTimes);
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