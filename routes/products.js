const express = require("express")
const router = express.Router()
const Products = require("../models/products")

// smoke
router.get("/", async (req, res, next) => {
    try {
        return res.status(200).send("Success!")
    } catch (err) {
        next(err)
    }
})

// retrieve recommended products
router.post("/recommended", async (req, res, next) => {
    try {
        const needs = req.body
        const productRecs = await Products.fetchRecommended(needs)
        return res.status(200).json({ productRecs })
    } catch (err) {
        next(err)
    }
})

module.exports = router