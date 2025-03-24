const chalk = require("chalk");

chalk.level = 1; // Use colours in the VS Code Debug Window

const chalkLog = chalk.green;
const chalkInfo = chalk.yellow.bgGreen;
const chalkError = chalk.red;
const chalkWarning = chalk.yellow.bgRed; // Orange color

// console.log(chalkLog('chalkLog!'));
// console.log(chalkInfo('chalkInfo!'));
// console.log(chalkError('chalkError!'));
// console.log(chalkWarning('chalkWarning!'));

const log = (text) => {
    return console.log(chalkLog(text));
}
const info = (text) => {
    return console.log(chalkInfo(text));
}
const error = (text) => {
    return console.log(chalkError(text));
}
const warn = (text) => {
    return console.log(chalkWarning(text));
}

module.exports = {
    log,
    info,
    error,
    warn,
};
