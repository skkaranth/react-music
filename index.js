// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();
// Initialize Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb+srv://skkaranth:JHphjKqwbnUcqJh@mymongodb.bxjdenj.mongodb.net/?retryWrites=true&w=majority&appName=mymongodb', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log(err));

mongoose.connect(process.env.MONGODB_CONNECT_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    // mongoose.connect('mongodb://localhost:27017/company', { useNewUrlParser: true, useUnifiedTopology: true })
    // .then(() => console.log('MongoDB Connected'))
    // .catch(err => console.log(err));

// Define Employee schema
const EmployeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    department: String
});

const Employee = mongoose.model('employee', EmployeeSchema);

// Routes

// Get all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single employee by ID
app.get('/employees/:id', getEmployee, (req, res) => {
    res.json(res.employee);
});

// Create an employee
app.post('/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        position: req.body.position,
        department: req.body.department
    });
    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware function to get single employee by ID
async function getEmployee(req, res, next) {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee == null) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.employee = employee;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Update an employee
app.patch('/employees/:id', getEmployee, async (req, res) => {
    if (req.body.name != null) {
        res.employee.name = req.body.name;
    }
    if (req.body.position != null) {
        res.employee.position = req.body.position;
    }
    if (req.body.department != null) {
        res.employee.department = req.body.department;
    }
    try {
        const updatedEmployee = await res.employee.save();
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an employee
app.delete('/employees/:id', getEmployee, async (req, res) => {
    try {
        await res.employee.remove();
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
