import express from 'express';

const router = express.Router();

// GET /marker - Retrieve all markers
router.get('/', async (req, res) => {
    try {
        const markers = await req.models.Markers.find({});
        res.status(200).json(markers);
    } catch (err) {
        console.error("Error fetching markers:", err);
        res.status(500).json({ error: "Failed to fetch markers" });
    }
});

// POST /marker - Add a new marker
router.post('/', async (req, res) => {
  try {
    if (req.session.isAuthenticated) {
      const { title, description, latitude, longitude } = req.body;
      if (!title || !description || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: "All fields (title, description, latitude, longitude) are required." });
      }
      const newMarker = new req.models.Markers({
          title,
          description,
          latitude,
          longitude
      });

      await newMarker.save();

      res.status(201).json({ message: "Marker created successfully!", marker: newMarker });
    }
  } catch (err) {
      console.error("Error saving marker:", err);
      res.status(500).json({ error: "Failed to save marker" });
  }
});

export default router;