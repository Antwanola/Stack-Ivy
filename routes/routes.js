const express = require('express')
, router = express.Router()
, bcrypt = require('bcrypt');
const passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')




router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'main'
    next()
})


//get home
router.get('/', (req, res)=>{
    res.render('pages/signIn')
})

router.get('/signUp', (req, res)=>{
    res.render('pages/signUp')
})

router.get('/signIn', (req, res)=>{
    res.render('pages/signIn')
})

router.get('/exist', (req, res)=>{
    return res.send(`<h1>Please sign in instead as the user already exist</h1>`)

})
//Register
router.post('/register', (req, res)=>{
    
 try {
  
    const user = new User({
        userName:req.body.userName,
        email:req.body.email,
        password:req.body.password
    })
    console.log(user.password)
    bcrypt.genSalt(10, (err, salt)=>{
        if(err) throw err
        bcrypt.hash(user.password, salt,( err, hash)=>{
            if(err) throw err
            user.password = hash
           
            user.save().then(saved=>{
                 
              
              })    
        })
    })
    // req.flash('home_message',`You are sucessfully registered as ${user.email}. Please Login`)
    res.redirect('/signIn')   
 } catch (error) {
    throw error
 }
  

    
    

})

//Login with passport middlewear
passport.use(new LocalStrategy({usernameField: 'email'},
    (email, password, done)=> {
        User.findOne({email:email}).lean().then(user=>{
            
            if (!user) {
                return done(null, false, );
              }
              
              bcrypt.compare(password, user.password,(err, matched)=>{
                  if(err) return err
                  if(matched){
                    
                      return done(null, user)
                     
                  }
                  else{
                        return done(null, false)
                  }
              })
        })
    }
  ))

  passport.serializeUser(function(user, done) {
   
    done(null, user._id);
    
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  })
  
//login
router.post('/login', async(req, res, next)=>{
    await passport.authenticate('local', { 
        
    successRedirect: '/admin',
    failureRedirect: '/',
    failureFlash: true
})(req, res , next)

})
//Logout
router.get('/logout',  (req, res)=>{
    req.logOut()
    res.redirect('/')
})






module.exports = router