const express = require('express');
const config = require('config');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const app = express();
const consoleErrorColor = "\x1b[31m%s\x1b[0m";

//Connect To DB
if (config.get('mongoURI')) {
    connectDB();
} else {
    console.log(consoleErrorColor, 'DB is not connected')
}

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({ origin: true, credentials: true }));

// Define routes
if (config.get('mongoURI')) {
    app.use('/api/auth', require('./routes/api/auth'));
    app.use('/api/shifts', require('./routes/api/shifts'));
    app.use('/api/employees', require('./routes/api/employees'));
} else {
    console.error(consoleErrorColor, 'Routes dependent of DB cannot be initialized into app')
}


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));