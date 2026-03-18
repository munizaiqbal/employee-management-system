const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const mongo = require('mongoose')
const PORT = process.env.PORT
const employeeRoutes = require('./routes/employeeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cors = require('cors');
app.use(cors());


app.use('/api/auth', require('./routes/auth'));
console.log("✅ Mounted /api/auth routes");
app.use('/api/user', require('./routes/user'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/profile-updates', require('./routes/profileUpdate'));

app.use('/api/dashboard', dashboardRoutes);
// after other routes
app.use('/api/employees', employeeRoutes); // ✅ mount it

app.listen(PORT,()=>{
    mongo.connect(process.env.MONGO_URL).then(()=>{
        console.log("Mongo DB Connected")
    })
    .catch(()=>{
        console.log("Failed to Connect MOngoDB")
    })
    console.log(`App Started at ${PORT}`)
})
