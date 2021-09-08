const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'jojoBA123321',
  database: 'fake_company'
});

module.exports = db;


// const sql = `SELECT employees.first_name +' '+ employees.last_name AS Name, roles.title, department.department_name, roles.salary
// FROM employees
// LEFT JOIN roles ON employees.role_id = roles.id
// LEFT JOIN department ON roles.department_id = department.id;`
