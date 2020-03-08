const inquirer = require ("inquirer")
const mysql = require('mysql');
const cTable = require('console.table');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: '@Bensmat08',
    database: 'employee_DB',
});

connection.connect(function(err){
    if(err) throw err;
    console.log(`connected as id: ${connection.threadId}`);
    intro();
    
});
function intro(){
    console.log('Welcome to the Employee Database!');
    startUp();
}

    function startUp(){
        inquirer.prompt(
        [
            {
                type: 'list',
                name: 'queryResponse',
                message: 'Would you like to do?',
                choices: ['View All Employees','View All Employees by Dept','View all Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'Remove Role','View All Departments','Add Department', 'Remove Department', 'Review Department Budget', 'Exit']
            }

        ]).then(function(answer){
            switch(answer.queryResponse){
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'Review Department Budget':
                    deptBudget();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                case 'View All Employees':
                    viewAllEmps();
                    break;
                case 'View All Employees by Dept':
                    viewEmpsDept();
                    break;
                case 'View all Employees by Manager':
                    viewEmpsMgr();
                    break;
                case 'Remove Employee':
                    removeEmp();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Update Employee Manager':
                    updateMgr();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Remove Role':
                    removeRole();
                    break;
                case 'Remove Department':
                    removeDept();
                    break;
                

            }
        })
    }

function viewDepts(){
    connection.query('SELECT * FROM department', function(err, res){
        if(err) throw err;
        console.table(res);
        startUp();
    })
}
function deptBudget(){
    let depts = [];
    connection.query('SELECT name FROM department', function(err, res){
        if(err) throw err;
        for(i=0; i<res.length; i++){
            depts.push(res[i].name)
        }
        inquirer.prompt(
            [
                {
                    type: 'list',
                    message: 'Which Dept? ',
                    name: 'chosenDept',
                    choices: depts
                }
            ]
        ).then(deptData =>{
            connection.query('SELECT id from department WHERE ?', {name: deptData.chosenDept}, function(err, res){
                if(err) throw err;
                connection.query('SELECT SUM(salary) FROM role WHERE ?',{department_id: res[0].id}, function(err, res){
                    if(err) throw err;
                    console.log(res);
                    startUp();
                })
            })
        })
    })
}
function updateRole(){
    let emps =[];
    let roles =[];
    connection.query('SELECT first_name FROM employee', function(err, res){
        if(err) throw err;
        for(i=0; i<res.length; i++){
            emps.push(res[i].first_name)
        }
        connection.query('SELECT title FROM role', function(err, res1){
            if(err) throw err;
            for(i=0; i<res1.length; i++){
                roles.push(res1[i].title)
            }
        
            inquirer.prompt(
                [
                    {
                        type: 'list',
                        message: 'Select Employee to update: ',
                        name: 'empName',
                        choices: emps
                    },
                    {
                        type: 'list',
                        message: 'New Role: ',
                        name: 'empRole',
                        choices: roles
                    }

                ]
            ).then(empData =>{
                connection.query('SELECT id FROM role WHERE ?', {title: empData.empRole}, function(err, res){
                    if(err) throw err;
                    let newRole = 'UPDATE employee SET role_id = '+res[0].id+" WHERE first_name = '"+empData.empName+"'"
                    connection.query(newRole, function(err, res){
                        if(err) throw err;
                        console.log(empData.empName+' has been given the new title: '+empData.empRole);
                        startUp();
                    })
                })
            })
        })
    })
}
function updateMgr(){
    let emps =[];
    connection.query('SELECT first_name FROM employee', function(err, res){
        if(err) throw err;
        for(i=0; i<res.length; i++){
            emps.push(res[i].first_name)
            }
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Select Employee to update: ',
                    name: 'empName',
                    choices: emps
                },
                {
                    type: 'list',
                    message: 'Select New Manager: ',
                    name: 'mgrName',
                    choices: emps
                }
            ]).then(empData =>{
                connection.query('SELECT id FROM employee WHERE ?', {first_name: empData.mgrName}, function(err, res){
                    if(err) throw err;
                    let empUpdate = 'UPDATE employee SET manager_id = '+res[0].id+' WHERE first_name = '+"'"+empData.empName+"'";
                    connection.query(empUpdate, function(err, res){
                        if(err) throw err;
                        console.log(empData.mgrName+' is now listed as Manager for '+empData.empName);
                        startUp();
                    })
                })
            })
    })

}
function viewEmpsMgr(){
    let emps =[];
    connection.query('SELECT first_name FROM employee', function(err, res){
        if (err) throw err;
        for(i=0; i<res.length; i++){
        emps.push(res[i].first_name)
        }
        inquirer.prompt(
            [
                {
                    type: 'list',
                    message: 'Select Manager: ',
                    name: 'chosenMgr',
                    choices: emps
                }
            ]
        ).then(mgr =>{
            connection.query('SELECT id FROM employee WHERE ?', {first_name: mgr.chosenMgr}, function(err, res){
                if(err) throw err;
                console.log(res[0].id)
            
                connection.query('SELECT * FROM employee WHERE ?', {manager_id: res[0].id}, function(err, res){
                    if (err) throw err;
                    console.table(res)
                    if(res >= 0){
                        console.log('No employees currently listed under '+mgr.chosenMgr+' please try again')
                    }
                    startUp();
                })
            })
        })
    })
}  
function viewEmpsDept(){
    connection.query('SELECT name FROM department', function(err, res) {
        if (err) throw err;
        let depts = res;
        inquirer.prompt(
            [
                {
                    type: 'list',
                    message: 'Dept: ',
                    name: 'chosendept',
                    choices: depts
                }
            ]
        ).then(dept =>{
            let deptID = [];
            deptIDquery = 'SELECT id FROM department WHERE ?'
            connection.query(deptIDquery, {name: dept.chosendept}, function(err, res){
                if(err) throw err;
                deptID.push(res[0].id);
                let deptRoles =[];
                deptRolesQuery = 'SELECT id from role WHERE ?'
                connection.query(deptRolesQuery, {department_id: deptID}, function(err, res){
                    if(err) throw err;
                    for(i=0; i<res.length; i++){
                    deptRoles.push(res[i].id);
                    }
                    empQuery = 'SELECT first_name, last_name FROM employee WHERE role_id IN ('+deptRoles+')';
                    connection.query(empQuery, function(err, res){
                        if(err) throw err;
                        console.table(res);
                        startUp();
                    } )
                    
                })
            })
        })
    })
}
function viewRoles(){
    connection.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function(req, res){
        if(req) throw req;
        console.table(res);
        startUp();
    })
}  
function viewAllEmps(){
    connection.query('CREATE TABLE manager AS SELECT id, first_name AS manager_name FROM employee', function(err, res){
        if(err) throw err;
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, manager.manager_name FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id LEFT JOIN manager ON employee.manager_id=manager.id', function(req, res){
            if(req) throw req;
            console.table(res);
            connection.query('DROP TABLE manager', function(err, res){
                if(err) throw err;
                startUp();
            });
        })
    })
}    

function addDepartment(){
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'deptid',
                message: 'Department ID: ',
            },
            {
                type: 'input',
                name: 'deptname',
                message: 'Department Name: ',
                
            }
        ]
    ).then(newdept => {
        connection.query('INSERT INTO Department SET ?',
            {
                id: newdept.deptid,
                name: newdept.deptname
            },
            function(err, res){
                if (err) throw err;
                console.log("New Department "+newdept.deptname+ " successfully added")
                startUp();
            })

    })
};


function removeEmp(){
    let emps = [];
    connection.query('SELECT first_name FROM employee', function(err, res){
        if(err) throw err;
        for(i=0; i<res.length; i++){
            emps.push(res[i].first_name);
        }
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'delEmp',
                    message: 'Employee for Deletion: ',
                    choices: emps
                }
            ]
        ).then(chosenEmp => {
            var empQuery = 'DELETE FROM employee WHERE ?'
            connection.query(empQuery,{first_name: chosenEmp.delEmp}, function(err, res) {
            if(err) throw err;
            console.log(chosenEmp.delEmp+" successfully deleted!")
            startUp();
            })
        })
    })
};

function addRole(){
    connection.query('SELECT name FROM department', function(err, res) {
        if (err) throw err;
        let depts = res;
    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'roleid',
                message: 'Role ID: '
            },
            {
                type: 'input',
                name: 'rolename',
                message: 'Role Name: '
            },
            {
                type: 'input',
                name: 'rolesalary',
                message: 'Role Salary: ',
                validate: function validatePrice(salary)
                {
                    var reg = /^\d+$/;
                    return reg.test(salary) || "Salary should be a number!";
                }
            },
            {
                type: 'list',
                name: 'roledeptid',
                message: 'Which department does this role belong to?',
                choices: depts
            }

        ]
    ).then(newrole => {
        var idquery = 'SELECT id FROM department WHERE ?';
        connection.query(idquery,{name: newrole.roledeptid}, function(err, res) {
            if(err) throw err;
            connection.query('INSERT INTO role SET ?',
                {
                    id: newrole.roleid,
                    title: newrole.rolename,
                    salary: newrole.rolesalary,
                    department_id: res[0].id

                },
                function(err, res){
                    if (err) throw err;
                    console.log(newrole.rolename+" successfully created!")
                    startUp();
            })
        })
    })
})

}



function addEmployee() {
    let roles = [];
    let mgrs =['None', ];
    connection.query('SELECT * FROM role', function(err, res) {
        if (err) throw err;
         for(i=0; i<res.length; i++){
         roles.push(res[i].title)
        }
        connection.query('SELECT first_name FROM employee', function(err, res){
            if(err) throw err;
            for (i=0; i<res.length; i++){
                    if(err) throw err;
                    mgrs.push(res[i].first_name);
                    }
                    inquirer.prompt(
                        [
                            {
                                type: 'input',
                                name: 'firstname',
                                message: 'Employee First Name: ',
                            },
                            {
                                type: 'input',
                                name: 'lastname',
                                message: 'Employee Last Name: ',
                            },
                            {
                                type: 'input',
                                name: 'empID',
                                message: 'Employee ID: ',
                            },
                            {
                            type: 'list',
                            name: 'emprole',
                            message: 'Employee Role: ',
                            choices: roles
                            },
                            {
                                type: 'list',
                                name: 'empMgr',
                                message: 'Employee Manager: ',
                                choices: mgrs
                
                            }
                        ]
                    ).then(newEmp =>{
                        let mgrID;
                        if(newEmp.empMgr =='None'){
                            mgrID = null;
                        }
                        else 
                        {
                        let mgridQuery = 'SELECT id from employee WHERE ?'
                        connection.query(mgridQuery, {first_name: newEmp.empMgr}, function(err, res){
                            if(err) throw err;
                            mgrID = res[0].id
                            })
                        }
                        
                        let roleidQuery = 'SELECT id from role WHERE ?'
                        connection.query(roleidQuery, {title: newEmp.emprole}, function(err, res1){
                            if(err) throw err;

                         
                        connection.query('INSERT INTO employee SET ?',
                            {
                                id: newEmp.empID,
                                first_name: newEmp.firstname,
                                last_name: newEmp.lastname,
                                role_id: res1[0].id,
                                manager_id: mgrID
                
                            },
                            function(err, res){
                                if (err) throw err;
                                console.log(newEmp.firstname+" successfully added!")
                                startUp();
                        })
                    })
                
                
            })
        })
    })
}

    


function removeRole(){
    connection.query('SELECT title FROM role', function(err, res) {
        if (err) throw err;
        let roles = [];
        for(i=0; i<res.length; i++){
            roles.push(res[i].title)
        }
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'delrole',
                    message: 'Which role would you like to delete?',
                    choices: roles
                }
            ]
        ).then(chosenrole => {
            var rolequery = 'DELETE FROM role WHERE ?'
            connection.query(rolequery,{title: chosenrole.delrole}, function(err, res) {
            if(err) throw err;
            console.log(chosenrole.delrole+" successfully deleted!")
            startUp();
            })
        })
    })
}

function removeDept(){
    connection.query('SELECT name FROM department', function(err, res) {
        if (err) throw err;
        let depts = [];
        for(i=0; i<res.length; i++){
            depts.push(res[i].name)
        }
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'deldept',
                    message: 'Which role would you like to delete?',
                    choices: depts
                }
            ]
        ).then(chosendept => {
            var deptquery = 'DELETE FROM department WHERE ?'
            connection.query(deptquery,{name: chosendept.deldept}, function(err, res) {
            if(err) throw err;
            console.log(chosendept.deldept+" successfully deleted!")
            startUp();
            })
        })
    })
}