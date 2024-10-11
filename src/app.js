const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  initializeRoutes() {
    this.app.use('/api', userRoutes);
  }

  listen(port) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

// Export an instance of the App class
module.exports = new App();
