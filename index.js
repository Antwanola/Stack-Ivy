const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
, handlebars = require('express-handlebars').engine
, passport = require('passport')
, mongoose = require('mongoose')
, methodOverride = require('method-override')
, cookiePaser = require('cookie-parser')
, session = require('express-session')
, app = express()
, path = require('path')
, dbUrl = require('./config/dbConnection')
, routes = require('./routes/routes')
, adminRoute = require('./routes/adminRoute')




app.use(cors())
app.use(morgan('dev'))
//dev_URI
mongoose.connect(dbUrl.dbUrl,{
        useNewUrlParser: true
    }).then(db => {
        console.log("db secured")
    })
    .catch(err => {
        console.log(err)
    })



    //serving files as static
app.use(express.static(path.join(__dirname, 'public')))




// Set view engine
app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Use plugins
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())


//Method
app.use(methodOverride('_method'));

app.use(cookiePaser());
const sessionMiddle = (session({

    secret: 'ajhsbjhafb774364',
    resave: true,
    saveUninitialized: true

}));
app.use(sessionMiddle)


// PASSPORT

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
    res.locals.url = req.originalUrl,
    res.locals.host = req.get('host')
    res.locals.user = req.user || null,
    // res.locals.message = req.flash('message')
    // res.locals.home_message = req.flash('home_message')
    // res.locals.error= req.flash('error')
    
    next()
    })


app.use('/',routes)
app.use('/admin',adminRoute)



app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404
    next(error)
})
app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            status:error.status,
            message: error.message
        }
     })
     next()
})


const port = process.env.PORT || 4600;

app.listen(port, ()=>{

console.log(`listening on port 4600`);

});