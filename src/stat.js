const core = require('@actions/core');
const glob = require('@actions/glob');

const fs = require('fs');
const { filesize } = require('filesize');
const path = require('path');

module.exports = {
  async extractFiles() {
    const filesBlob = core.getInput('files', { required: true });
    core.info(`File patterns: ${filesBlob}`);
  
    const globOptions = {
      followSymbolicLinks: core.getInput('follow_symbolic_links')
    };
  
    // Split the input by newlines and commas to handle multiline and comma-separated values
    const patterns = filesBlob.split(/\r?\n|,/).map(pattern => pattern.trim());
    const globber = await glob.create(patterns.join('\n'), globOptions)
  
    let outputList = [];
    
    for await (const file of globber.globGenerator()) {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);

        const out = {
          ...path.parse(file),
          file,
          relative: path.relative(process.cwd(), file),
          size: stats.size,
          sizeJedec: filesize(stats.size, { standard: 'jedec' }),
          mtime: stats.mtime,
          mtimeLocale: stats.mtime.toLocaleDateString(),
          ctime: stats.ctime,
          ctimeLocale: stats.ctime.toLocaleDateString()
        };

        core.debug(out);
        outputList.push(out);
      }
    }

    return outputList;
  }
}