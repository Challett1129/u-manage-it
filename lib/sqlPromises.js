const { restoreDefaultPrompts } = require('inquirer');
const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const db = require('../db/connections');
const connection = require('../db/connections');

let departmentArr = []

    connection.query(`SELECT * FROM departments`, (err, rows) => {
        if (err) {
        console.log(err);   
        }
        rows.forEach(obj => {
            let departmentObj = {}
            departmentObj.name = obj.department_name;
            departmentObj.value = obj.id
            departmentArr.push(departmentObj);
        })
        return departmentArr
})



//Class object that contains all relative sql query functions
class SqlFunctions {
    constructor(){
        
    }



// returns all employees joined with their salaries, departments, job, and manager
getEmployees() {
   return new Promise (function (resolve, reject) {
       const sql = `SELECT e.id, e.first_name, e.last_name,
       COALESCE(roles.title, 'N/A') AS title,
       COALESCE(departments.department_name, 'N/A') AS department, 
       COALESCE(roles.salary, 'N/A') AS salary,
       CONCAT_WS(' ', m.first_name, m.last_name) AS manager
       FROM employees e 
       LEFT JOIN employees m ON e.manager_id = m.id
       LEFT JOIN roles on e.role_id = roles.id
       LEFT JOIN departments on roles.department_id = departments.id`
        connection.query(sql, (err, rows) => {
           if (err) {
               reject(err);
               return;
           }
           resolve(console.table(rows));
       });
   });
};

//returns all departments
getDepartments() {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT * FROM departments`

        connection.query(sql, (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(console.table(rows));
        });
    });
};

//returns all roles
getRoles() {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT * FROM roles` 

        connection.query(sql, (err, rows) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(console.table(rows));
        });
    });
};

//adds a new department to departments table
addDepartment() {
    return new Promise ((resolve, reject) => {
        resolve((inquirer
            .prompt([
                {
                    type: 'input',
                    name:'departmentName',
                    message: 'What is the name of the new department?',
                    validate: inputCheck => {
                        if(inputCheck) {
                            return true;
                        } else
                        {
                            console.log(`Please input a name. (cannot be greater than 30 characters)`)
                            return false;
                        }
                    }
                }
            ]))
           )
        })
        .then(({ departmentName }) => {
            const sql = `INSERT INTO departments (department_name) 
            VALUES (?)`;
            
            connection.query(sql, departmentName, (err, rows) => {
                if (err) {
                    console.log(error)
                }
            });
        });
        
};

//adds a new role to a department, a new salary, and a title
addRole() {
    return new Promise ((resolve, reject) => {
        resolve((inquirer
                .prompt(
                    
                   [
                    {
                        type: 'input', 
                        name: 'roleName', 
                        message: 'What is the name of the new role?',
                        validate: inputCheck => {
                            if(inputCheck) {
                                return true;
                            } else {
                                console.log(`Please input a name. (cannot be greater than 30 characters)`)
                            }
                        }
                    },
                    {
                        type: 'input', 
                        name: 'salaryAmt',
                        message: 'What is the salary for this role?',
                        validate: inputCheck => {
                            parseInt(inputCheck);
                            if(!isNaN(inputCheck)) {
                                return true;
                            } else {
                                console.log(` Must be a dollar amount`)
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'departmentName', 
                        message: 'Which department does this role belong to?',
                        choices: departmentArr
                    }
                ])
                ))
            })
            .then(({roleName,  salaryAmt, departmentName}) => {
                const sql = `INSERT INTO roles (title, salary, department_id)
                VALUES (?,?,?)`
                const params = [roleName, parseInt(salaryAmt), departmentName]
                connection.query(sql, params, (err, rows) => {
                    if(err) {
                        console.log(error);
                    }
                });
            });
};

//adds a new employee
addEmployee() {
    return new Promise ((resolve, reject) => {
        resolve((
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'employeeName', 
                        message: `What is the new employee's first name?`,
                        validate: inputCheck => {
                            if(inputCheck && isNaN(inputCheck)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                ])
        ))
    })

};

};


module.exports = SqlFunctions