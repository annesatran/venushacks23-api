const db = require("../db")

const { BadRequestError } = require("../utils/errors")

class Products {

    static async fetchRecommended(needs) {

        // check that all required fields are there / is not a malformed request body
        const requiredFields = ["cleanser", "toner", "serum", "moisturizer", "sunscreen", 
                                "safety", "comedogenic",
                                "oily", "dry", "sensitive", 
                                "acne_fighting", "anti_aging", "brightening", "uv"]
        requiredFields.forEach((field) => {
            if (!needs.hasOwnProperty(field)) {
                throw new BadRequestError("Invalid request body")
            }
        })

        // initialize return JSON
        var productRecs = {
            "cleanser": null,
            "toner": null, 
            "serum": null,
            "moisturizer": null,
            "sunscreen": null
        }

        // algorithm to produce query string that filters skintype
        var chosenSkintypes = ["oily", "dry", "sensitive"].filter((type) => eval("needs."+type))
        const skintypeQueryMap = chosenSkintypes.map(skintype => skintype+" is TRUE")
        const skintypeQuery = skintypeQueryMap.length > 0 ? "AND ("+ skintypeQueryMap.join(" OR ")+")" : ""

        // algorithm to produce query string that ranks product by skin needs
        var chosenSkinNeeds = ["acne_fighting", "anti_aging", "brightening", "uv"].filter((need) => eval("needs."+need))
        var skinNeedsQuery = chosenSkinNeeds > 0 ? chosenSkinNeeds.join(" + ") : "0" 
        ///////// To-do : check
        skinNeedsQuery += (needs.oily == true) ? " + comedogenic" : ""

        // loop through each skincare category and produce results
        for (const [key, _] of Object.entries(productRecs)) {
            if (eval("needs."+key)) {
                const query = 
                    `SELECT *, SUM(${skinNeedsQuery}) AS ranking   
                    FROM products
                    WHERE type = $1 AND safety >= "50"
                    ${skintypeQuery}
                    ORDER BY ranking
                    LIMIT 20`
                var result = await db.query(query, [key])
                eval("productRecs."+key+" = "+"result.rows") // update product recs JSON
            }
        }
        return productRecs
    }
}

module.exports = Products
