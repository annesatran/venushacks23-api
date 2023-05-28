const db = require("../db")

const { BadRequestError } = require("../utils/errors")

class Products {

    //needs an array
    static async fetchRecommended(needs) {

            console.log('needs', needs)
        // check that all required fields are there / is not a malformed request body
        const requiredFields = ["cleanser", "toner", "serum", "moisturizer", "sunscreen", 
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
        var chosenSkintypes = ["oily", "dry", "sensitive"].filter((type) => needs[type] == 1)
        const skintypeQueryMap = chosenSkintypes.map(skintype => `"${skintype}" = 1`)
        const skintypeQuery = skintypeQueryMap.length > 0 ? "AND ("+ skintypeQueryMap.join(" OR ")+")" : ""

        // algorithm to produce query string that ranks product by skin needs

        var chosenSkinNeeds = ["acne_fighting", "anti_aging", "brightening", "uv"].filter((need) => needs[need])
        chosenSkinNeeds = chosenSkinNeeds.map((need) => `"${need}"`)
        var skinNeedsQuery = chosenSkinNeeds > 0 ? chosenSkinNeeds.join(" + ") : "0" 
        skinNeedsQuery += (needs.oily == true) ? ` + "comedogenic"` : ""

        let promises = [];

        const categories = ["cleanser", "toner", "serum", "moisturizer", "sunscreen"]
        categories.forEach( (item) => {
            const query = 
                `SELECT *, SUM(${skinNeedsQuery}) AS "ranking"  
                FROM products
                WHERE "type" = $1 AND "safety" >= '50' ${skintypeQuery}
                GROUP BY "id"
                ORDER BY "ranking"
                LIMIT 3;`;
            promises.push(db.query(query, [item]))
        });

        const resultOfPromises = await Promise.all(promises);
        // update product recs JSON
        resultOfPromises.forEach((result, index) => {
            productRecs[categories[index]] = result.rows
        })

        return productRecs
    }
}

module.exports = Products
