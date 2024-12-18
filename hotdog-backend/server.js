require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const employerRoutes = require('./routes/employerRoutes');
const skillsRoutes = require('./routes/api/skills'); 
const healthConditionsRoutes = require('./routes/api/healthConditions');
const jobRoutes = require('./routes/jobRoutes'); 

const connectDB = require('./config/db');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/api/auth', authRoutes);  
app.use('/api/users', userRoutes);  
app.use('/api/employer', employerRoutes);  
app.use('/api/skills', skillsRoutes);  
app.use('/api/healthConditions', healthConditionsRoutes);
app.use('/api/jobs', jobRoutes); 

app.get('/test', (req, res) => {
  console.log('Received a request at /test');
  res.send('Server is working!');
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is now listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

//boss wala ako ginalaw dyannnn ung mmga tinanggal ko noon e di kasama yan -derek
// HAHAHAHAHAHAHAHAHHAHAHA
// si kier toh       

start(); // MAY NAGREMOVE NETONG start(); -j