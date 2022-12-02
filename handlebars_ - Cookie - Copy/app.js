const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const seceret = "assd123^&*^&*ghghggh";
const oneDay = 1000 * 60 * 60 * 24;
const sessions = require('express-session');
const PORT = 9999;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
//database connection
const nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');

let transporter=nodemailer.createTransport({
    service:"gmail",
    port:587,
    secure:false,
    auth:{
        user:"farmanhaider240@gmail.com",
        pass:"srjxfghezmkienjf"
    }
});
mongoose.connect("mongodb://localhost:27017/authmongo")
    .then(res => console.log("MongoDB Connected"))
    .catch(err => console.log("Error : " + err));
//end
app.use(sessions({
    secret: seceret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
transporter.use('compile', hbs(
    {
        viewEngine:"nodemailer-express-handlebars",
        viewPath:"emailTemplates/"
    }
));
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(cookieParser());
const userModel = require('./Model/User');
var session;
app.get("/", (req, res) => {
    //let username=req.cookies.username;
    session = req.session;
    if (session.username) {
        return res.render("home", { uname: session.username })
    }
    else {
        return res.render("login");
    }
})
app.get("/login", (req, res) => {
    let auth = req.query.msg ? true : false;
    if (auth) {
        return res.render("login", { error: 'Invalid username or password' });
    }
    else {
        return res.render("login");
    }
})
app.post("/postlogin", (req, res) => {
    console.log("received")
    let { uname, password } = req.body;
    userModel.findOne({ username: uname }, (err, data) => {
        if (err) {
            return res.redirect("/login?msg=fail");
        }
        else if (data == null) {
            return res.redirect("/login?msg=fail");
        }
        else {
            if (bcrypt.compareSync(password, data.password)) {
                session = req.session;
                session.username = uname;
                console.log(req.session);
                return res.redirect("/welcome");
            }
            else {
                return res.redirect("/login?msg=fail");
            }
        }
    })


})

app.get("/regis", (req, res) => {
    res.render("regis");
})
app.post("/postregis", (req, res) => {
    let { email, uname, password } = req.body;
    let status = 0;
    const hash = bcrypt.hashSync(password, saltRounds);
    userModel.create({ email: email, username: uname, password: hash, status: status })
        
        .then(data => {
            let mailOptions={
    from:'farmanhaider240@gmail.com',
    to:email,
    subject:"Testing Mail",
                template: 'mail',
                context: {
                    id: data._id,
                    uname: uname
                }
}
transporter.sendMail(mailOptions,(err,info)=>{
    if(err){ console.log(err)}
    else{
         console.log("Mail send : "+id)
    }
})        
            res.redirect('/login');
        })
        .catch(err => {
            res.render("regis", { error: "User Already Registered"})
            
        })

})
app.get("/welcome", (req, res) => {
    //let username=req.cookies.username;
    let username = req.session.username;
    if (username) {
        return res.render("welcome", { username: username })
    }
    else {
        return res.redirect("/login");
    }
})
app.get('/act/:id', (req, res) => {
    let id = req.params.id;
    
    userModel.findOne({ _id: id }, (err, data) => {
        console.log(data);
        if (err) {
            res.send("kuch to gadbad hai")
        }
        else {
            userModel.updateOne({ _id: id }, { $set: { status: "1" } })
                .then(data1 => {
                    res.render('activate', {username:data.username });
                })
                .catch(err => {
                    res.send("something went wrong");
                })
        
            
        }
    })
   
    
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    //res.clearCookie("username");
    return res.redirect("/login");
})
app.listen(PORT, (err) => {
    if (err) throw err
    else {
        console.log(`Server work on ${PORT}`)
    }
})