const core = require("@actions/core");
const { filesize } = require("filesize");

const path = require("path");
const fs = require("fs");
const colors = require("picocolors");

module.exports = {
  generateOutput_json(output) {
    const outputJSON = core.getInput('output_json');

    if (outputJSON && outputJSON !== 'false') {
      core.debug(`Writing output to JSON in file "${outputJSON}"`);
      fs.writeFileSync(outputJSON, JSON.stringify(output, undefined, 4));
      core.info(`Wrote output to JSON in file "${outputJSON}"`);
    }
  },
  
  generateOutput_text(output) {
    core.setOutput('file_info', output.map(({ file, size, mtimeISO }) => {
      return `${file}\t${size}\t${mtimeISO}`;
    }));
  },
  
  generateOutput_log(output) {
    return output.forEach(({ file, size, mtimeISO }) => {
      const dir = path.dirname(file);
      const base = path.basename(file);
  
      core.info(`${(dir ? `${colors.dim(dir)}${path.sep}` : '') + `${colors.green(base)}`}\t${colors.bold(size)}\t${colors.italic(mtimeISO)}`);
    });
  },
  
  generateOutput_summary(output) {
    const totalSize = output.reduce((acc, { sizeBytes }) => acc + sizeBytes, 0);
    const totalSizeJedec = filesize(totalSize, { standard: 'jedec' });
  
    core.info(`Total files: ${colors.bold(output.length)}`);
    core.info(`Total size (bytes): ${colors.bold(totalSize)}`);
    core.info(`Total size (jedec): ${colors.bold(totalSizeJedec)}`);
  }
}