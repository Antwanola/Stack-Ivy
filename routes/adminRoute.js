const express = require('express')
const router = express.Router()

const {userAuth} = require('../Helper/userAuth')
const user = require('../models/user')



router.all('/*',userAuth, (req, res, next)=>{
    req.app.locals.layout = 'admin'
    next()
})


//get home
router.get('/', (req, res)=>{
    user.find({email:req.user.email}).then(user=>{
    //    let data = user
       console.log(req.user)
        res.render('admin/page', {data:req.user.userName})
    })
    
})


// router.get('/', (req, res)=>{
//     res.render('layouts/admin')
// })

// router.get('/', (req, res)=>{
//     res.render('layouts/admin')
// })




module.exports = router