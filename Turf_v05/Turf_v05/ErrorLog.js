const fs = require('fs');
const path = require('path');

function logErrorToFile(error) {

    const year = new Date().getFullYear();
    const month = new Date().toLocaleString('en-US', { month: 'short' });
    const day = new Date().getDate();

    const directoryPath = path.join(__dirname, 'ErrorLog');
    const filePath = path.join(directoryPath, `ErrorLog_${year}-${month}-${day.toString().padStart(2, '0')}.txt`);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    const logMessage = `\n${new Date().toISOString()}: ${error.stack}\n`;

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to the error log file:', err);
        }
    });
}

function consoleLog(error) {

    const year = new Date().getFullYear();
    const month = new Date().toLocaleString('en-US', { month: 'short' });
    const day = new Date().getDate();

    const directoryPath = path.join(__dirname, 'ErrorLog');
    const filePath = path.join(directoryPath, `ErrorLog_${year}-${month}-${day.toString().padStart(2, '0')}.txt`);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    const logMessage = `\n${new Date().toISOString()}: ${error}\n`;

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to the error log file:', err);
        }
    });
}

module.exports = { logErrorToFile, consoleLog };
