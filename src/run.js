const core = require('@actions/core');

const { generateOutput_log, generateOutput_summary, generateOutput_text, generateOutput_json } = require('./outputs');
const { extractFiles } = require('./stat');

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    extractFiles().then(fileList => {
      generateOutput_log(fileList);
      generateOutput_summary(fileList);
  
      generateOutput_text(fileList);
      generateOutput_json(fileList);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = { run }
