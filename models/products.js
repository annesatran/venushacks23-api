const db = require("../db")

const { BadRequestError } = require("../utils/errors")

class Products {

    static async fetchRecommended(needs) {

        // check that all required fields are there / is not a malformed request body
        const requiredFields = ["cleanser", "toner", "serum", "moisturizer", "sunscreen", 
                                "safety", "comedogenic",
                                "oily", "dry", "sensitive", 
                                "acne-fighting", "anti-aging", "brightening", "uv"]
        requiredFields.forEach((field) => {
            if (!needs.hasOwnProperty(field)) {
                throw new BadRequestError("Invalid request body")
            }
        })

        var productRecs = { // initialize return JSON
            "cleanser": null,
            "toner": null, 
            "serum": null,
            "moisturizer": null,
            "sunscreen": null
        }

        // algorithm to produce query string that matches skintype
        var skintypes = ["oily", "dry", "sensitive"].filter((type) => eval("needs."+type))
        

        // algorithm to produce query string that matches skin needs

        // loop through each skincare category and produce results
        for (const [key, _] of Object.entries(productRecs)) {
            if (eval("needs."+key)) {
                const query = `
                    SELECT * FROM products
                    WHERE type = $1 AND
                `
                var result = await db.query(query, [key])
                eval("productRecs."+key+" = "+"result.rows") // update product recs JSON
            }
        }
        return productRecs
    }

}

module.exports = Products
