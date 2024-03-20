const mysql = require('mysql2');
const readline = require('readline');

let connection;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function connectToDatabase() {
  // Prompt user for username
  rl.question("Enter MySQL username: ", (username) => {
    // Prompt user for password
    rl.question("Enter MySQL password: ", (password) => {
      connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: username,
        password: password,
        database: process.env.DB_NAME,
      });

      connection.connect((err) => {
        if (err) {
          console.error("\nError connecting to database:", err.message + "\n");
          // recursively prompt for credentials again
          connectToDatabase();
        } else {
          console.log("\nConnected to the MySQL server.");
          displayMenu();
          // disconnectAndExit();
        }
      });
    });
  });
}

function displayMenu() {
  console.log("\nMenu:");
  console.log("1: Display the spell types");
  console.log("2: Disconnect from the database and close the application");
  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case '1':
        displaySpellTypes();
        break;
      case '2':
        disconnectAndExit();
        break;
      default:
        console.log("\nInvalid choice.  Please try again.");
        displayMenu();
        break;
    }
  });
}

function displaySpellTypes() {
  console.log("\nTODO");
  displayMenu();
}

function disconnectAndExit() {
  connection.end((err) => {
    if (err) {
      console.error("\nError disconnecting from database:", err.message);
    } else {
      console.log("\nDisconnected from the database.");
    }
    rl.close();
    console.log("Exiting...\n");
    process.exit(0);
  });
}

connectToDatabase();