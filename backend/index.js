import express from 'express'
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import adminRoutes from './routes/adminRoutes.js';
import session from 'express-session';
import courseRoutes from './routes/courseRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import questionRoutes from './routes/questionRoutes.js';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
connectDB()
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 