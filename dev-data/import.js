const fs = require('fs');
const chalk = require('chalk');
const config = require('../config/config');

const log = console.log;
const errorStyle = chalk.bold.red;
const successStyle = chalk.bold.green;
const warnStyle = chalk.bold.yellow;


const User = require('./models/userModel');

//db connection
  const connectDatabase = require("../db/connect");

const seedDB = async () => {
    // READ JSON FILE
    const users = await JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

    //Insert into DB
    await User.create(users);
    log(successStyle('Data seeded successfully'));
    process.exit();
}

// IMPORT JSON INTO DB
const importData = async() => {
  try {
    await connectDatabase().then(async () => {
      await seedDB();
    });

  } catch (err) {
    log(errorStyle("importData err", err));
  }
};

//DELETE ALL DATA ON DB:
const deleteData = async() => {
  try {
    await connectDatabase().then(async () => {
      await User.deleteMany();
      console.log('Data successfully deleted');
    });
  } catch (err) {
    console.log(errorStyle("deleteData err", err))
  }
  process.exit();
}

// const importData = async() => {
//   try {
//     await User.create(users);
//     console.log('Data seeded successfully');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// DELETE ALL DATA ON DB:
// const deleteData = async() => {
//   try {
//       await Techie.deleteMany();
//       console.log('Data successfully deleted');
//   } catch (error) {
//       console.log(error)
//   }
//   process.exit();
// }

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv);



