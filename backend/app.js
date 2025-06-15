const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const { connectToMongoDB } = require('./config');
const studentRoutes = require('./routes/studentRoute');
const departmentRoutes = require('./routes/departmentRoute')
const classRoutes = require('./routes/classRoute')
const teacherRoutes = require('./routes/teacherRoute')
const attendanceRouter =require('./routes/attendanceRoute')
const markRouter = require("./routes/markRoute")
const adminRouter = require("./routes/adminRoute")
const app = express();

// Database connection
connectToMongoDB('mongodb+srv://robinsamuelkutty77:ueYGp5TiyGCH2AkL@cepcluster.9tsxf.mongodb.net/?retryWrites=true&w=majority&appName=CEPCluster');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001','https://ecapcepoonjar.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Routes
app.use('/api', studentRoutes);
app.use('/api',departmentRoutes);
app.use('/api',classRoutes);
app.use('/api',teacherRoutes);
app.use('/api',attendanceRouter);
app.use('/api',markRouter);
app.use('/api',adminRouter)

app.get('/', (req, res) => {
  res.send('🎉 Backend is working!');
});
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const PORT =  5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
