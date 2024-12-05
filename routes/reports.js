import express from 'express';
var router = express.Router();

/* GET reports listing. */
router.get('/', async (req, res) => {
  try {
    let userNameInput = req.query.username;
    let reportsAll = null;
    if (userNameInput != null) {
      reportsAll = await req.models.Reports.find({ username: userNameInput});
    } else {
      reportsAll = await req.models.Reports.find();
    }
    
    const reportData = await Promise.all(
      reportsAll.map(async report => {
        return {
            id: report._id,
            username: report.username,
            title: report.title,
            location: report.location,
            description: report.description
        };
      })
    );
    res.json(reportData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

/* POST reports listing. */
router.post('/', async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    if (req.session.isAuthenticated) {

    
      const { title, location, description } = req.body;
      console.log(title + " " + location + " " + description);
      if (!title || !location || !description) {
        console.log("title: " + title)
        return res.status(400).json({ status: "error", error: "Missing title, location, or description" });
      }
      const newReport = new req.models.Reports({
        username: req.session.account.username,
        title: title,
        location: location,
        description: description
      });
      await newReport.save();

      const username = req.session.account.username;
      const user = await req.models.Users.findOne({ username: username});
      if (user) {
        const reportCount = await req.models.Reports.countDocuments({ username: username});
        user.crimesReported = reportCount;
        await user.save();
      } else {
        console.log("User not found while updating crimesReported")
      }

      res.json({ status: "success" });
    } else {
      res.json({
        status: "error",
        error: "not logged in"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
