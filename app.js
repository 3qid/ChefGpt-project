require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ضفنا هذا السطر عشان الـ cors يشتغل
const authroutes = require('./routes/authroutes');
const chatRoutes = require('./routes/chatRoutes');

// 1. أولاً: تعريف الـ app
const app = express();

// 2. ثانياً: تعريف المتغيرات من الـ env
const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';
const port = process.env.PORT || 3000; // تأكد أن الاسم في الـ .env هو PORT كابيتال

// 3. ثالثاً: الـ Middleware (الترتيب هنا مهم جداً)
app.use(cors({
  origin: frontend_url 
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 4. رابعاً: الـ Routes
app.use(authroutes);
app.use('/api/chats', chatRoutes);

app.get('/h', (req, res) => {
    res.send('Hello World!');
});

// 5. خامساً: الاتصال بقاعدة البيانات وتشغيل السيرفر
const dbURI = process.env.MONGODB_URI ;

mongoose.connect(dbURI)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));