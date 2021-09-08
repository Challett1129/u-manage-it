const inquirer = require('inquirer');
const db = require('./db/connections');
const cTable = require('console.table');
const { getEmployees } = require('./utils/sqlPromises');


init = () => {
    return inquirer
        .prompt([
            {
                type: 'list', 
                name: 'menu', 
                message: 'What would you like to do?',
                choices: ['View my employees', 'Chicken']
            }
        ])
}


async function choices() {
    init().then(choice => {
    if(choice === 'View my employees')
    getEmployees();
    })
    
}

choices();