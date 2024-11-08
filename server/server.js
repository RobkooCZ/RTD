const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from 'src/public/styles' for CSS
app.use('/styles', express.static(path.join(__dirname, '..', 'src', 'public', 'styles')));

// Serve static files from 'dist' for JavaScript
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));  // Serve JS from 'dist' under /dist

// Serve static files from 'public' for HTML
app.use('/html', express.static(path.join(__dirname, '..', 'src', 'public'))); 

// Serve tower images
app.use('/towerImages', express.static(path.join(__dirname, '..', 'src', 'towers', 'images')));

// Serve mainmenu.html from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.resolve('mainmenu.html'));  // Ensure this points to the root directory
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
