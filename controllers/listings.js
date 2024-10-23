const express = require('express')
const router = express.Router()

const Listing = require('../models/listing')

// render a list of all the listings (READ ALL)
router.get('/', async (req, res) => {
  try {
    const populatedListings = await Listing.find({}).populate('owner')
    console.log('listings: ', populatedListings)
    res.render('listings/index.ejs', {
      listings: populatedListings,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// render a new listing form (CREATE part 1)
router.get('/new', (req, res) => {
  res.render('listings/new.ejs')
})

// create (submit new listing form) (CREATE part 2)
router.post('/', async (req, res) => {
  req.body.owner = req.session.user._id
  await Listing.create(req.body)
  res.redirect('/listings')
})

// show route (READ ONE)
router.get('/:listingId', async (req, res) => {
  try {
    const populatedListing = await Listing.findById(
      req.params.listingId
    ).populate('owner')
    res.render('listings/show.ejs', {
      listing: populatedListing,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// delete (DELETE)
router.delete('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId)

    if (listing.owner.equals(req.session.user._id)) {
      await listing.deleteOne()
      res.redirect('/listings')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// render the edit form (UPDATE part 1)
router.get('/:listingId/edit', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId)
    res.render('listings/edit.ejs', {
      listing: currentListing,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// submit the edit form (UPDATE part 2)
router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId)
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body)
      res.redirect('/listings')
    } else {
        res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router
