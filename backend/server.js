const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const adminRoutes = require('./routes/adminroutes');
const doctorRoutes = require('./routes/doctorroutes');
const labRoutes = require('./routes/labroutes');
const receptionistRoutes = require('./routes/receptionistroutes');
const authRoutes = require('./routes/authroutes');
const pharmacistRoutes = require('./routes/pharmacistroutes');

const app = express();

app.use(cors({ origin: 'https://thosc-hms.netlify.app', credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  //  useUnifiedTopology: true
//})
//.then(() => console.log('✅ Connected to MongoDB'))
//.catch((err) => console.log(`❌ Database connection error: ${err}`));

// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch((err) => console.log(`❌ Database connection error: ${err}`));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
    console.log('❌ Connection error details:');
    console.log('Message:', err.message);
    console.log('Cause:', err.cause);
    console.log('Full error:', JSON.stringify(err, null, 2));
});

app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/labTechnician', labRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/pharmacist', pharmacistRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to THOSC HMS API' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5080;
app.listen(PORT, () => console.log(`🚀 THOSC HMS running on port ${PORT}`));
