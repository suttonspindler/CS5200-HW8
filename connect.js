const mysql = require('mysql2');
const readline = require('readline');

// Define connection here (must be global);
// `let` instead of `const` must be used because connecting to and closing the database are considered reassignments
let connection;

// Handles user input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// connect to database by prompting user for username and password
// recursively calls on itself until correct credentials are entered in
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
        }
      });
    });
  });
}

// displays the menu and allows user to select option;
// recursively calls on itself upon entering invalid menu option
function displayMenu() {
  console.log("\nMenu:");
  console.log("1: Display the spell types");
  console.log("2: Disconnect from the database and close the application");

  // menu options are displayed, prompt user for selection
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

// displays types of spells
// TODO: prompt user to enter in spell type
function displaySpellTypes() {
  connection.query("SELECT type_name FROM spell_type", (err, results) => {
    if (err) {
      console.error("Error fetching spell types:", err.message);
    } else {
      console.log("\nSpell types:");
      results.forEach((row) => {
        console.log(row.type_name);
      });
    }
    displayMenu();
  });
}

// close the database connection and end the program
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

// first function to call (connect to the database)
connectToDatabase();