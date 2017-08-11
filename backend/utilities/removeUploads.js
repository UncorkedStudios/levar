const FileCleaner = require('cron-file-cleaner').FileCleaner;
files = ['/uploads', '/downloads'];

const fileCleanerOptions = {
  start: true,
  recursive: true
};
// Every 24 hours, remove files older than 24 hours
exports.fileWatcher = (dirname) => {
	files.forEach((file) => {
		new FileCleaner(dirname + file, 86400000,  '0 0 * * * *', fileCleanerOptions);
	});
};
