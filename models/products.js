const db = require("../db")

const { BadRequestError } = require("../utils/errors")

class Products {

    static async fetchRecommended(needs) {
        if (!(needs.routine && needs.skintype && needs.concerns)) {
            throw new BadRequestError("Invalid request body")
        }        

        return productRecs
    }

}

module.exports = Products
