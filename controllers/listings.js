const express = require('express')
const router = express.Router()

const Listing = require('../models/listing')

router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find({})
        console.log('listings: ', listings)
        res.render('listings/index.ejs')
    } catch (error) {
        console.log(error)
    }
})

router.get('/new', (req, res) => {
    res.render('listings/new.ejs')
})

module.exports = router