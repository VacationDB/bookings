const app = require('./app.jsx');

// set port environment variable to prepare for deployment
const port = process.env.PORT || 3004;

app.listen(port, () => console.log(`Server running on port ${port}`));
