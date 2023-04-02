$(document).ready(onReady);

//Two onclick functions: One to add an employee, one to delete and employee
function onReady() {
    $('#submit-btn').on('click', addEmployee);
    $('#employee-rows').on('click', '.delete-btn' ,deleteEmployee);
}

//Global varaibles
// employees - array of employee objects
// monthlyAmount - running total of monthly salary breakdown
let employees = [];
let monthlyAmount = 0;


//Add employee function
function addEmployee(event) {
    event.preventDefault();

    //initialize employee object
    //employe object = {
    //     employee.firstName : String
    //     employee.lastName : String
    //     employee.id : Number
    //     employee.title : Number
    //     employee.annualSalary : Number
    // }
    let employee = {};


    //Assign input field values to employee object properties, converting annualSalary input string to Number
    employee.firstName = $('#first-name').val();
    employee.lastName = $('#last-name').val();
    employee.id = $('#id').val();
    employee.title = $('#title').val();
    unformattedSalary = $('#annual-salary').val();
    employee.annualSalary = Number(unformattedSalary.replace(/[^0-9.-]+/g,""));

    //Resetting the input fields to be empty
    $('#first-name').val('')
    $('#last-name').val('')
    $('#id').val('')
    $('#title').val('')
    $('#annual-salary').val('')

    //Append the table row to the employee table body, formatting the number to $x,xxx.xx using the formatCurrency function
    $('#employee-rows').append(`
        <tr>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td class='id'>${employee.id}</td>
            <td>${employee.title}</td>
            <td>${formatCurrency(employee.annualSalary)}</td>
            <td><button class='delete-btn'>Delete</button></td>
        </tr>
    `);

    //Pushing the employee object to the employees array
    // and then running the updateMonthly function, passing it the employees array (Just realizing it is global and probably don't need to do this but oh well)
    employees.push(employee);
    updateMonthly(employees);
}

//updateMonthly function, specifically used to update the monthly expense tracker
function updateMonthly(employeesArr) {
    
    //initialize counter total to use in tracking total monthly 
    total = 0;
    
    //Loop through employee objects and add the rounded version of the annualSalary divided by the number of months in a year
    for (let employee of employeesArr) {
        total += Math.round((Number(employee.annualSalary) / 12) * 100) / 100;
    }

    //Reformat the currency using the formatCurrency function
    //Setting the text of the monthly-amount span to monthlyAmount
    monthlyAmount = formatCurrency(total);
    $('#monthly-amount').text(monthlyAmount);

    //Checking if the total is greater than 25,000 and swapping the classes to indicate an overage
    if (total > 25000) {
        $('#total-section').removeClass('under');
        $('#total-section').addClass('over');
    }
}

//deleteEmployee function handles the deletion of a row and then removing that amount from the Total Monthly span (This function is kind of convoluded and hacky but hey, it works)
function deleteEmployee() {

    //Unformat and convert the current annual salary -> divide that by months in a year -> convert total monthly amount to number
    unformatSalaryAmount = Number($(this).parent().prev().text().replace(/[^0-9.-]+/g,""))
    subtractedAmount = unformatSalaryAmount / 12;
    formattedAmount = Number($('#monthly-amount').text().replace(/[^0-9.-]+/g,""));
    
    //subtract the total monthly amount by the employees monthly amount and format it for reentry into the index.html
    updatedAmount = formattedAmount - subtractedAmount;
    monthlyAmount = formatCurrency(updatedAmount);
    
    //Ensure the monthlyAmount is greater than one to deal with rounding issues, set to 0 if it isn't.
    if (updatedAmount < 1) { 
        monthlyAmount = 0; 
    }

    //Update the span with the monthly amount
    $('#monthly-amount').text(monthlyAmount);
    
    //If the updated amount (preformated) is less than 25000, remove the .over css class
    if (updatedAmount < 25000) {
        $('#total-section').removeClass('over');
    }

    //Now to remove the row itself, we are going to retrieve the employee id of the row
    //The difficulty here was also updating the employees array to ensure the employees annualsalary was also removed from further calculations
    employeeID = $(this).closest('tr').find('.id').text();

    //Loop through the employees array, checking if the employee.id matches employeeID and splice if it does
    for (i in employees) {
        if (employees[i].id == employeeID) {
            employees.splice(i);
        }
    }

    //remove the row
    $(this).closest('tr').remove();

    //Ensure that there's nothing left over when the last employee row is deleted
    if ($('#employee-rows tr').length < 1) {
        monthlyAmount = 0;
    }

}

//formatCurrency function used to format the currency into a $x,xxx.xx String
function formatCurrency(currency) {

    const formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });

    return formatter.format(currency)
}
