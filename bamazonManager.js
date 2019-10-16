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
    managerQuery();
});

//FUNCTIONS
// The managerQuery function allows users to 
// (1) View products for sale
// (2) View low inventory
// (3) Add to inventory 
// (4) Add a product
// 
//It includes an additional function to continue or exit.
//+++++++++++++++++++++++++++++++++++++++++++++++

// Prompts the user for the action they require
function managerQuery(){
    inquirer.prompt([{
        type: 'list',
        name: 'input',
        message: 'Welcome to the Bamazon management database. Enter an option.',
        choices: ['1) View inventory', '2) View low inventory', '3) Add to inventory', '4) Add a product']
    }]).then(function(answer){
        // 1) VIEW INVENTORY
        if(answer.input === '1) View inventory'){
            // Points to products table in bamazon_db
            connection.query('SELECT * FROM products', function(err,res){
            if (err) throw err;
            console.log('');
            // Iterates through products table; displays inventory
            console.log('+++++++++++++ INVENTORY ITEMS ++++++++++++');
            for(i=0;i<res.length;i++){
                console.log('Item ID: ' + res[i].id);
                console.log('Product: ' + res[i].product_name);
                console.log('Department: ' + res[i].department_name);
                console.log('Item Price: ' + res[i].price);
                console.log('Quantity in Stock: ' + res[i].stock_quantity);
                console.log('------------------------------');
            }
            console.log('')
            // Calls newQuery for user to perform new action or exit
            newQuery();
        })
    }
    // 2) VIEW LOW INVENTORY
    else if(answer.input === '2) View low inventory'){
        // Points to products table in bamazon_db; 
        // Identifies stock counts under 50
        connection.query('SELECT * FROM products WHERE stock_quantity < 50', function(err,res){
            if (err) throw err;
            // If product inventories under 50 exist, they display
            console.log('')
            console.log('++++++++++ LOW INVENTORY ITEMS +++++++++');
            for(i=0;i<res.length;i++){
                console.log('Item ID: ' + res[i].id);
                console.log('Product: ' + res[i].product_name);
                console.log('Quantity in Stock: ' + res[i].stock_quantity);
                console.log('------------------------------');
            }
            // Calls newQuery for user to perform new action or exit
            newQuery();
        })
    }
    // 3) ADD TO INVENTORY
    else if(answer.input === '3) Add to inventory'){
        inquirer.prompt([{
            name: 'item',
            //Prompts the user to enter the item to update; validates as 
            // a whole number value
            message: 'Enter the ID of the inventory item to update',
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if(valid){
                    return true
                }
                //Prompts if entry is invalid
                    return 'Enter a valid product ID'
                }
        },{
            //Prompts the user to enter the inventory value to add
            // validates the entry as a whole number
            name: 'number',
            message: 'Enter the number of items to add to the product inventory',
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if(valid){
                    return true
                }
                //Prompts if entry is invalid
                    return 'Please enter a valid quantity'
                }
        //If product and update values are valid, then 
        //Then the update value is parsed as an integer
        // and added to the item's stock_quantity value
        }]).then(function(answer){
            connection.query('SELECT * FROM products WHERE id = ?', [answer.item], function(err, res){
                connection.query('UPDATE products SET ? Where ?', [{
                    stock_quantity: res[0].stock_quantity + parseInt(answer.number)
                },{
                    id: answer.item
                }], function(err, res){});
        })
        //Confirms update
        console.log('Inventory updated');
        // Calls newQuery for user to perform new action or exit
        newQuery();
    })
}
// 4) ADD A PRODUCT
else if(answer.input === '4) Add a product'){
    inquirer.prompt([{
        // Prompts user for product name
        name: 'product',
        message: 'Enter product name: '
    },{
        // Prompts user for department
        name: 'department',
        message: 'Enter the product department: '
    },{
        // Prompts user for price
        // Validates for numerical entry
        name: 'price',
        message: 'Enter the item price',
        validate: function(value){
            var valid = value.match(/^[0-9]+$/)
            if(valid){
                return true
            }
                return 'Enter a valid value'
            }
        },{
            // Prompts user for stock quantity
            name: 'stock',
            message: 'Enter the stock quantity',
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if(valid){
                    return true
                }
                    return 'Please enter a valid value'
                }
            // Adds the product name, department, price, and quantity
            // to product table
            }]).then(function(answer){
				connection.query('INSERT into products SET ?', {
					product_name: answer.product,
					department_name: answer.department,
					price: answer.price,
					stock_quantity: answer.stock
				}, function(err, res){});
				console.log('Product added');
				newQuery();
			})
		}
	})
};

// Prompts the user to perform a new action or exit
function newQuery(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to perform another transaction?'
	}]).then(function(answer){
		if(answer.choice){
			managerQuery();
		}
		else{
			console.log('Have a good day');
			connection.end();
		}
	})
}