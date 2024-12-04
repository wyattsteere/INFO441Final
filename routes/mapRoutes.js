import express from 'express';
import path from 'path'; 
var router = express.Router();

router.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/map.html'));
}); 

export default router;