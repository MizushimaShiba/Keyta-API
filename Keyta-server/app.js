const Cors = require('cors')
const express = require('express')
const app = express();
const port = process.env.PORT || 3001;
const base_endpoint = '/api';


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(Cors())

app.use(base_endpoint, require('./routes/axiosroutes'))


app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).json({
    message: error.message,
  });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
