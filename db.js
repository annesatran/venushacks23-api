const { getDatabaseUri } = require("./config")
const { Client } = require("pg")
require("colors")

const db = new Client({ connectionString: getDatabaseUri() })

db.connect(err => {
    if (err) {
        console.error("Connection error".red, err.stack)
    } else {
        console.log("Successfully connected to postgres db".blue)
    }
})

module.exports = db
