module.exports = {

    userAuth:(req,res, next)=>{
    if(req.isAuthenticated()){
        return  next()
    }
   new Error('error', `Please login to gain access to admin`); res.redirect('/')
    
    }
    
    }