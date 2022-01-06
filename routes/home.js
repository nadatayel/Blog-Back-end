const express = require('express');
const router = express.Router();
const {  getallHome  }=require('../controllers/blog')


//home page
router.get('/', async (req, res, next) => {
    try {
      const blogs = await  getallHome();
      res.json(blogs);
    } catch (e) {
      next(e);
    }
  });

  module.exports = router;
   