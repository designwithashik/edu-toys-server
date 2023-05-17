const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors')


//middleware

app.use(cors());
app.use(express.json());



// route startup

app.get('/', (req, res) => {
    res.send('Edu Toys is selling Educational Toys')
});
app.listen(port, () => {
    console.log(`The server is running on ${port}`)
})