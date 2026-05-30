require('dotenv').config(); // يجب أن يكون في أول سطر
const express = require('express')
const mongoose = require('mongoose') ; 
const authroutes = require('./routes/authroutes');
const chatRoutes = require('./routes/chatRoutes') ;
const cors = require('cors') ;
// تأكد أنه مكتوب هكذا:
const User = require('./models/User');// init app & middleware


 const Chat = require('./models/chat') ;
const app = express()
app.use(express.static('public')) ;
app.use(express.json()) ;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res ,next) => { console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`); next();
});

const dbURI = process.env.MONGODB_URI 

const url = process.env.port ; 

mongoose.connect(dbURI)
.then((result) => app.listen(url))
.catch((err) => console.log(err)) ; 




// في ملف app.js (الباك إند)
app.use('/api/user', authroutes); // أضف المسار هنا

app.use('/api/chats', chatRoutes) ;

app.get('/h', (req, res) => {
 res.send('Hello World!')
})