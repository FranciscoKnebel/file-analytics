const core = require("@actions/core");
const { filesize } = require("filesize");

const path = require("path");
const colors = require("picocolors");

module.exports = {
  generateOutput_json(output) {
    core.setOutput('file_json', JSON.stringify(output, undefined, 4));
  },
  
  generateOutput_text(output) {
    core.setOutput('file_info', output.map(({ file, sizeJedec, mtimeLocale }) => {
      const { dir, base } = path.parse(file);
  
      return `${(dir ? `${dir}` : '') + base}\t${sizeJedec}\t${mtimeLocale}`;
    }));
  },
  
  generateOutput_log(output) {
    return output.forEach(({ relative, sizeJedec, mtimeLocale }) => {
      const dir = path.dirname(relative);
      const base = path.basename(relative);
      
      const size = colors.bold(sizeJedec);
      const time = colors.italic(mtimeLocale);
  
      core.info(`${(dir ? `${colors.dim(dir)}${path.sep}` : '') + `${colors.green(base)}`}\t${size}\t${time}`);
    });
  },
  
  generateOutput_summary(output) {
    const totalSize = output.reduce((acc, { size }) => acc + size, 0);
    const totalSizeJedec = filesize(totalSize, { standard: 'jedec' });
  
    core.info(`Total files: ${colors.bold(output.length)}`);
    core.info(`Total size: ${colors.bold(totalSize)}`);
    core.info(`Total size (jedec): ${colors.bold(totalSizeJedec)}`);
  }
}