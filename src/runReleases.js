// src/runReleases.js
const ReleaseRunner = require('./config/releaseRunner'); // Correctly import the class

async function main() {
  const releaseRunner = new ReleaseRunner(); // Create an instance of ReleaseRunner
  await releaseRunner.runReleases(); // Call the runReleases method
}

main().catch(error => {
  console.error(`Failed to execute releases: ${error.message}`);
  process.exit(1);
});
