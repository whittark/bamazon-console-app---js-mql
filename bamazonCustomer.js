//Packages and vars
var inquirer = require('inquirer');
var mysql = require('mysql');

var amountOwed;
var currentDepartment;
var updateSales;

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
});

//FUNCTIONS
// The customer app has three primary functions: display inventory, place a new
// order, and continue or quit. 
//
// There are two additional functions after these to log and update sales 
// once an order is placed.
//
//+++++++++++++++++++++++++++++++++++++++++++++++

//DISPLAY INVENTORY
function displayInventory(){
    // Here I'm limiting my query to the products table in bamazon_db
    connection.query('SELECT * FROM products', function(err,res) {
        if (err) throw err;
        console.log('+++++++++++++++++++++++++++++++++++++');
        console.log('++++++++ WELCOME TO BAMAZON +++++++++');
        console.log('+++++++++ VIEW OUR ITEMS! +++++++++++');
        console.log('+++++++++++++++++++++++++++++++++++++');

        // Iterating through the items in the products table
        
        for(i=0;i<res.length;i++){
            // Console logging items and a separator bar; note that the response requests  
            // match the table columns in my schema
			console.log('Item ID:' + res[i].id + ' Product Name: ' + res[i].product_name + ' Price: ' + '$' + res[i].price + '(Quantity left: ' + res[i].stock_quantity + ')')
		}
		console.log('+++++++++++++++++++++++++++++++++++++');
		placeOrder();
		})
    }


//PLACE ORDER
// Prompts users to enter the ID of a product
function placeOrder(){
    inquirer.prompt([{
        name: 'selectId',
        message: 'Enter the product ID to purchase',
        // Verifies that the user enters valid numeric values
        validate: function(value){
            var valid = value.match(/^[0-9]+$/)
            if(valid){
				return true
			}
				return 'Enter a valid Product ID'
        }

    },{
        //Prompts the user for the number of items to purchase
        name: 'selectQuantity',
        message: 'Enter the quantity to purchase',
        //Validates the quantity entered
        validate: function(value){
			var valid = value.match(/^[0-9]+$/)
			if(valid){
				return true
			}
				return 'Enter a valid quantity'
        }
        
    //Logic to check the stock_quantity in MySQL and return a response
    }]).then(function(answer){
        connection.query('SELECT * FROM products WHERE id = ?', [answer.selectId], function(err, res){
            //If the quantity requested is greater than stock_quantity
            if(answer.selectQuantity > res[0].stock_quantity){
                console.log('Insufficient quantity');
                console.log('This order has been canceled');
                console.log('');
                // Calls the new order function to allow the customer
                // to order something else or reduce the quantity
                newOrder();
            }
            else{
                //If the quantity is available,
                //it's multiplied by the item price to display
                //the total amount owed
                amountOwed = res[0].price * answer.selectQuantity;
                currentDepartment = res[0].department_name;
                console.log('Your total is $' + amountOwed);
                console.log('');
                //The item quantity in the products table updates (MySQL)
                connection.query('UPDATE products SET ? Where ?', [{
                    //Here the stock_quantity is reduced by the quantity requested
                    stock_quantity: res[0].stock_quantity - answer.selectQuantity
                },{
                    id: answer.selectId
                }], function(err, res){});
                //This updates the department sales table used by managers and execs
                logSaleToDepartment();
                //newOrder is now called to allow users to continue shopping or quit
                newOrder();
            }
        })

    }, function(err, res){})
};

// CONTIUE SHOPPING OR EXIT
function newOrder(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to place another order?'
	}]).then(function(answer){
		if(answer.choice){
            //Calls placeOrder to allow for another product ID entry
			placeOrder();
		}
		else{
			console.log('Thank you for shopping with us!');
			connection.end();
		}
	})
};

// SECONDARY FUNCTIONS: Logging sales by department and updating the department table.
// These support Manager and Executive apps to view sales

//Updates sales for a department in the department table
function logSaleToDepartment(){
    connection.query('SELECT * FROM departments WHERE department_name = ?', [currentDepartment], function(err, res){
		updateSales = res[0].total_sales + amountOwed;
		updateDepartmentTable();
	})
};
// Updates total_sales for all departments in the department table
function updateDepartmentTable(){
    connection.query('UPDATE departments SET ? WHERE ?', [{
    total_sales: updateSales
},{
    department_name: currentDepartment
}], function(err, res){});
};

// Calls displayInventory to begin the shopping session
displayInventory();