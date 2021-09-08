const connection = require('../db/connections');

function getEmployees() {
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
                console.log(err.message);
                return;
            }
            resolve(console.table(rows));
        });
        connection.end();
    });
}

module.exports = { getEmployees }   