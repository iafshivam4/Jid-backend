const fs = require('fs');
const path = require('path');
const db = require('./database');

class ReleaseRunner {
  constructor() {
    // Set this.releasesFolder to the directory containing SQL files
    this.releasesFolder = path.join(__dirname, 'release'); 
  }

  async runReleases() {
    try {
      // Read the contents of the releases folder
      const files = fs.readdirSync(this.releasesFolder);
      for (const file of files) {
        // Ensure we only read .sql files
        if (path.extname(file) === '.sql') {
          const filePath = path.join(this.releasesFolder, file);
          const sql = fs.readFileSync(filePath, 'utf8').trim(); // Read and trim
          console.log(`Executing ${file}...`);
          await db.query(sql); // Execute the SQL content
          console.log(`${file} executed successfully.`);
        }
      }
    } catch (error) {
      console.error(`Error executing releases: ${error.message}`);
    }
  }
}

module.exports = ReleaseRunner;
