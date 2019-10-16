//Packages and vars
var inquirer = require('inquirer');
var mysql = require('mysql');

//Local host connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Allegro11!',
    database: 'bamazon_db'
});

//Connect method to accept callback functions or display an error
connection.connect(function(err) {
    if (err) throw err;
    console.log('Connection ID: ' + connection.threadId)
    executiveQuery();
});

//FUNCTIONS
// The executiveQuery function allows users to 
// (1) View sales by department
// (2) Add a new department
// 
//It includes an additional function to continue or exit.
//+++++++++++++++++++++++++++++++++++++++++++++++

// Prompts the user for the action they require
function executiveQuery(){
	inquirer.prompt([{
		name: 'input',
		type: 'list',
        message: 'Enter a value for the action to perform',
		choices: ['1) View Sales By Department', '2) Create New Department']
	}]).then(function(answer){
        // 1) VIEW SALES BY DEPARTMENT
		if(answer.input === '1) View Sales By Department'){
            console.log('');
            // Points to the departments table in bamazon_db
			connection.query('SELECT * FROM departments', function(err, res){
                // Iterates through the departments table
                // Returns the department sales 
				console.log('SALES BY DEPARTMENT');
				for(i=0; i<res.length; i++){
					var profit = res[i].total_sales - res[i].overhead_cost;
					console.log('Department ID: ' + res[i].department_id + ' | ' + 'Department Name: ' + res[i].department_name);
					console.log('Overhead Costs: ' + res[i].overhead_cost);
                    console.log('Total Sales: ' + res[i].total_sales);
                    // Profit is total sales minus overhead costs
					console.log('Total Profit: ' + profit);
					console.log('-----------------');
                }
            // Calls function to perform a new action or exit
			newQuery();
			})
		}
		else{
            // Calls function to add a new department
			addDepartment();
		}
	})
};

//Prompts the user to peform a new action or exit
function newQuery(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to perform another transaction?'
	}]).then(function(answer){
		if(answer.choice){
            //Calls executiveQuery with action menu
			executiveQuery();
		}
		else{
			console.log('Have a nice day');
			connection.end();
		}
	})
}

// 2) ADD A DEPARTMENT
function addDepartment(){
	inquirer.prompt([{
		name: 'department',
		message: 'Enter a department name: '
	},{
		name: 'overhead',
		message: 'Enter overhead costs: '
	}]).then(function(answer){
		//Variables to hold the department and overhead values
		var department = answer.department;
        var overhead = answer.overhead;
        // Adds department and overhead values to departments table
		connection.query('INSERT INTO departments SET ?', {
			department_name: department,
			overhead_cost: overhead
        }, function(err, res){});
        // Calls function to perform a new action or exit
		newQuery();
})};