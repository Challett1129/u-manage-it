const inquirer = require('inquirer');
const connection = require('./db/connections');
const cTable = require('console.table');
const SqlFunctions = require('./lib/sqlPromises');

let goodbye = `
   ▄██████▄   ▄██████▄   ▄██████▄  ████████▄ ▀█████████▄ ▄█    ▄      ▄████████ 
███    ███ ███    ███ ███    ███ ███   ▀███   ███    ███ ███   ██▄   ███    ███ 
███    █▀  ███    ███ ███    ███ ███    ███   ███    ███ ███▄▄▄███   ███    █▀  
███        ███    ███ ███    ███ ███    ███  ▄███▄▄▄██▀  ▀▀▀▀▀▀███  ▄███▄▄▄     
███ ████▄  ███    ███ ███    ███ ███    ███ ▀▀███▀▀▀██▄  ▄██   ███ ▀▀███▀▀▀     
███    ███ ███    ███ ███    ███ ███    ███   ███    ██▄ ███   ███   ███    █▄  
███    ███ ███    ███ ███    ███ ███   ▄███   ███    ███ ███   ███   ███    ███ 
████████▀   ▀██████▀   ▀██████▀  ████████▀  ▄█████████▀   ▀█████▀    ██████████ 

                                                                                `

console.log(`
▄█     █▄     ▄████████  ▄█        ▄████████  ▄██████▄    ▄▄▄▄███▄▄▄▄      ▄████████ 
███     ███   ███    ███ ███       ███    ███ ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ 
███     ███   ███    █▀  ███       ███    █▀  ███    ███ ███   ███   ███   ███    █▀  
███     ███  ▄███▄▄▄     ███       ███        ███    ███ ███   ███   ███  ▄███▄▄▄     
███     ███ ▀▀███▀▀▀     ███       ███        ███    ███ ███   ███   ███ ▀▀███▀▀▀     
███     ███   ███    █▄  ███       ███    █▄  ███    ███ ███   ███   ███   ███    █▄  
███ ▄█▄ ███   ███    ███ ███▌    ▄ ███    ███ ███    ███ ███   ███   ███   ███    ███ 
▀███▀███▀    ██████████ █████▄▄██ ████████▀   ▀██████▀   ▀█   ███   █▀    ██████████ 
▀                                                            
                                                              
`)

userPrompt = () => {
    return inquirer
        .prompt([
            {
                type: 'list', 
                name: 'choice', 
                message: 'What would you like to do?',
                // choices: ['View all employees', 'View all departments', 'Exit']
                choices: [
                    {name: 'View all employees'},
                    {name: 'View all departments'},
                    {name: 'View all roles'},
                    {name: 'Add a department'},
                    {name: 'Add a role'},
                    {name: 'Add an employee'},
                    {name: 'Exit'}
                    
                ]
            },
                
        ])
        .then(({choice}) => {
            console.log(choice)
            return choice;
        });
};

function init(){
const sql = new SqlFunctions
    userPrompt().then(async response => {
        if(response === "View all employees") {
           await sql.getEmployees();
            init();
        } 
        else if (response === "View all departments") {
            await sql.getDepartments();
            init();
        } else if (response === "View all roles") {
            await sql.getRoles();
            init();
        } else if (response === "Add a department") {
            await sql.addDepartment();
            init();
        } else if (response === "Add a role") {
            await sql.addRole();
            init();
        } else if (response === "Add an employee") {
            await sql.addEmployee();
            init();
        }
        else if (response === "Exit") {
            console.log(goodbye);
            connection.end();
        } else {
            console.log('There was an error with the application')
            connection.end();
        }
    })
    .catch(err => {
        console.log(err);
    })
    
};




// getDepartmentsArr();
init();
