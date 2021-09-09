const inquirer = require('inquirer');
const { last } = require('rxjs');
const connection = require('../db/connections');

//array to hold all departments
let departmentArr = [];
//array to hold all roles
let rolesArr = [];
//array to hold all employees for manager prompt
let employeesArr = [];
connection.query(`SELECT * FROM departments`, (err, rows) => {
    if (err) {
        console.log(err);   
        };
        //for each department we assign its name and value to an object which is pushed into an array to be used in the inquirer prompt
        rows.forEach(obj => {
            let departmentObj = {}
            departmentObj.name = obj.department_name;
            departmentObj.value = obj.id
            departmentArr.push(departmentObj);
        });
        return departmentArr
});

connection.query(`SELECT * FROM roles`, (err, rows) => {
    if (err) {
        console.log(err);
    };
    //for each role in the roles table we save the title and id to an object which is pushed into an array to be used in the inquirer prompt
    rows.forEach(role => {
        let rolesObj = {}
        rolesObj.name = role.title;
        rolesObj.value = role.id;
        rolesArr.push(rolesObj);
    });
    return rolesArr
});

connection.query(`SELECT * FROM employees`, (err, rows) => {
    if (err) {
        console.log(err);
    };
    //for each employee in the employees table we save the name and id to an object which is pushed into an array to be used in the inquirer prompt
    rows.forEach(employee => {
        let employeeObj = {}
        employeeObj.name = employee.first_name + ' ' + employee.last_name;
        employeeObj.value = employee.id;
        employeesArr.push(employeeObj);
    })
    return employeesArr
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
                        name: 'firstName', 
                        message: `What is the new employee's first name?`,
                        validate: inputCheck => {
                            if(inputCheck && isNaN(inputCheck)) {
                                return true;
                            } else {
                                console.log(`Please enter a name`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input', 
                        name: 'lastName',
                        message: `What is the new employee's last name?`,
                        validate: inputCheck => {
                            if(inputCheck && isNaN(inputCheck)) {
                                return true;
                            } else {
                                console.log(`Please enter a name`);
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list', 
                        name: 'selectRole',
                        message: `What is the role of the new employee?`,
                        choices: rolesArr
                    },
                    {
                        type: 'confirm',
                        name: 'managerConfirm',
                        message: 'Does this employee have a manager?',
                        default: true
                    },
                    {
                        type: 'list', 
                        name: 'managerName',
                        message: `Who is the manager for this employee?`,
                        choices: employeesArr,
                        when: ({ managerConfirm }) => {
                            if(managerConfirm === true) {
                                return true;
                            } else {
                                return false
                            }
                        }
                    }
                ])
        ))
    })
    .then(({firstName, lastName, selectRole, managerName}) => {
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
        VALUES (?,?,?,?)`
        let manager = managerName || null
        const params = [firstName, lastName, selectRole, manager];
        connection.query(sql, params, (err, rows) => {
            if(err) {
                console.log(err);
            }
        })
    })

};
//selects an employee and updates their role
updateEmployeeRole() {
    return new Promise ((resolve, reject) => {
        resolve ((
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee', 
                        message: 'Which employee would you like to update?',
                        choices: employeesArr
                    },
                    {
                        type: 'list', 
                        name: 'newRole', 
                        message: `What is this employee's new role?`,
                        choices: rolesArr
                    }
                ])
        ))
    })
    .then(({employee, newRole}) => {
        console.log(employee, newRole)
        const sql = `UPDATE employees SET role_id = ? where id = ? `
        const params = [newRole, employee]

        connection.query(sql, params, (err, rows) => {
            if (err) {
                console.log(err);
            }
        })
    })
};

};


module.exports = SqlFunctions