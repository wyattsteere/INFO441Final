import express from 'express';
var router = express.Router();

/* GET reports listing. */
router.get('/', async (req, res, next) => {
  try {
    const reportsAll = await req.models.Reports.find();
    const reportData = await Promise.all(
      reportsAll.map(async report => {
        return {
            id: report._id,
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
router.post('/', async (req, res, next) => {
  console.log("Request Body:", req.body);
  try {
    const { title, location, description } = req.body;
    console.log(title + " " + location + " " + description);
    if (!title || !location || !description) {
      console.log("title: " + title)
      return res.status(400).json({ status: "error", error: "Missing title, location, or description" });
    }
    const newReport = new req.models.Reports({
      title: title,
      location: location,
      description: description
    });
    await newReport.save();
    res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
