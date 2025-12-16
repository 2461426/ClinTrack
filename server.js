const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to the JSON file
const trailDetailsPath = path.join(__dirname, 'src', 'data', 'trailDetails.json');

// Get all trails
app.get('/api/trails', (req, res) => {
  try {
    const data = fs.readFileSync(trailDetailsPath, 'utf8');
    const trails = JSON.parse(data);
    res.json(trails);
  } catch (error) {
    console.error('Error reading trails:', error);
    res.status(500).json({ error: 'Failed to read trails' });
  }
});

// Create a new trail
app.post('/api/trails', (req, res) => {
  try {
    // Read existing data
    const data = fs.readFileSync(trailDetailsPath, 'utf8');
    const trails = JSON.parse(data);
    
    // Add new trail
    const newTrail = req.body;
    trails.trailDetails.push(newTrail);
    
    // Write back to file
    fs.writeFileSync(trailDetailsPath, JSON.stringify(trails, null, 2), 'utf8');
    
    console.log('New trail added:', newTrail);
    res.json({ success: true, trail: newTrail });
  } catch (error) {
    console.error('Error creating trail:', error);
    res.status(500).json({ error: 'Failed to create trail' });
  }
});

// Update a trail
app.put('/api/trails/:id', (req, res) => {
  try {
    const trailId = parseInt(req.params.id);
    const updates = req.body;
    
    const data = fs.readFileSync(trailDetailsPath, 'utf8');
    const trails = JSON.parse(data);
    
    const index = trails.trailDetails.findIndex(t => t.trailId === trailId);
    if (index !== -1) {
      trails.trailDetails[index] = { ...trails.trailDetails[index], ...updates };
      fs.writeFileSync(trailDetailsPath, JSON.stringify(trails, null, 2), 'utf8');
      res.json({ success: true, trail: trails.trailDetails[index] });
    } else {
      res.status(404).json({ error: 'Trail not found' });
    }
  } catch (error) {
    console.error('Error updating trail:', error);
    res.status(500).json({ error: 'Failed to update trail' });
  }
});

// Delete a trail
app.delete('/api/trails/:id', (req, res) => {
  try {
    const trailId = parseInt(req.params.id);
    
    const data = fs.readFileSync(trailDetailsPath, 'utf8');
    const trails = JSON.parse(data);
    
    trails.trailDetails = trails.trailDetails.filter(t => t.trailId !== trailId);
    fs.writeFileSync(trailDetailsPath, JSON.stringify(trails, null, 2), 'utf8');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting trail:', error);
    res.status(500).json({ error: 'Failed to delete trail' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
