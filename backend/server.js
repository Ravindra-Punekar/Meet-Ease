require('dotenv').config();

const express = require('express');
const app = express();
const router = require('./routes');
const DbConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const corsOption = {
    credential: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));
 
const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json({limit: '8mb'}));

app.use(router);
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });
app.get('/', (req, res)=>{
    res.send('Hello from express js');
});


app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'});
  })

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));

