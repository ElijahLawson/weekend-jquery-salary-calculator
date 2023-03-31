$(document).ready(onReady);

function onReady() {
    $('#submit-btn').on('click', addEmployee);
}

let employees = [];

function addEmployee(event) {
    event.preventDefault();

    let employee = {};

    employee.firstName = $('#first-name').val();
    employee.lastName = $('#last-name').val();
    employee.id = $('#id').val();
    employee.title = $('#title').val();
    unformattedSalary = $('#annual-salary').val();
    employee.annualSalary = Number(unformattedSalary.replace(/[^0-9.-]+/g,""));

    $('#first-name').val('')
    $('#last-name').val('')
    $('#id').val('')
    $('#title').val('')
    $('#annual-salary').val('')

    $('tbody').append(`
        <tr>
            <td>${employee.firstName}</td>
            <td>${employee.lastName}</td>
            <td>${employee.id}</td>
            <td>${employee.title}</td>
            <td>${employee.annualSalary}</td>
        </tr>
    `);

    employees.push(employee);

    updateMonthly(employees);
}

function updateMonthly(employeesArr) {
    total = 0;
    const formatter = new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    
    for (let employee of employeesArr) {
        total += Math.round((Number(employee.annualSalary) / 12));
    }

    $('#monthly-amount').text(formatter.format(total))
}
