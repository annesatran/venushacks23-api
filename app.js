const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { PORT } = require("./config")
const productsRoutes = require("./routes/products")

const { BadRequestError, NotFoundError } = require("./utils/errors")

const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.get('/hello', (req, res) => {
    res.status(200).send("g'day mate!")
})

app.use("/products", productsRoutes)

// 404 error handler
app.use((req, res, next) => {
    return next(new NotFoundError())
})

// generic error handler
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message
    return res.status(status).json({
        error: { message, status }
    })
})

app.use('/request-type', (req, res, next) => {
    console.log('Request type: ', req.method);
    next();
  });



module.exports = app