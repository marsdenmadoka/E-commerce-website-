//if(process.env.NODE_ENV !== 'production'){ //checking if we are running in the production environment
                                           //if not then use dotenv environment
 //require('dotenv').load()     //load method loads all the variales in the .env file and put inside our process.env variable in our server
//}

require('dotenv').config()
const stripeSecretkey=process.env.STRIPE_SECRET_KEY
const stripePublickey=process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretkey, stripePublickey)

const express =require('express')
const app=express()
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const mongo=require('mongodb');
const mongoose=require('mongoose')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash=require("connect-flash");
const bcrypt=require('bcryptjs');
var expressValidator=require('express-validator');
const fs=require('fs') //allows us to read different file in our case we reading the items.json
const stripe = require('stripe')(stripeSecretkey,stripePublickey)
//const request=require('request'); //install this module for daraja API
var db=mongoose.connection;
 
app.set('view engine','ejs')
app.use(express.json())
var adminRouter=require('./routes/admin');//defineing routes
var userRouter=require('./models/user')


app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(cookieParser());
app.use('/admin',adminRouter);//using them
app.use('/user',userRouter);
app.use(flash())


app.get('/',function(req,res){
    fs.readFile('items.json',function(error,data){
if(error){
    res.status(500).end()

}else{
    res.render('index.ejs',{
        //stripePublickey:stripePublickey, //sending stripepublic key from our server to store.js
            items:JSON.parse(data)
        })


}
})

})
//daraja
//getting the access token
app.get('/access_token',access,(req,res)=>{
    res.status(200).json({access_token:req.access_token})
    
    })

function access(req,res,next){

        let url=""
        let auth=new Buffer("kEBcjA5qrO9sl9qJpPlDuBqPGfZHXqsa:nzDFobVhKPBw10MX").toString('base64');
        request(
        {
        url:url,
        headers:{
        "Authorization":"Basic"+auth
        }    
        },
        (error,response,body) => {
            if(error){
                console.log(error)
            }else{
         //let respose
         req.access_token=JSON.parse(body).access_token
         next()
        
            }
        
        }
        
        )
        
        }
//registering the url
app.get('/register',access,(req,res)=>{
let url=" "
let auth="Bearer"+req.acess_token
request({

url:url,
method:"POST",
headers:{
    "Authorization":auth
},
json:{
    "ShortCode":"",
    "ResponseType":"",
    "ConfirmationURL":"",
    "ValidationURL":" "

}
},
function(error,response,body){

    if(error){ console.log(error)}
    res.status(200).json(body)
}
)

})

//confirmation,validation and simulation
 app.post('/confirmation',(req,res)=>{
console.log('..............confirmation......')
console.log(req.body)
 })

 app.post('/validation',(req,res)=>{
console.log('.......validation.......')
console.log(req.body)
 })

 app.post('/simulate',access,(req,res)=>{
let url=""
let auth="Bearer"+req.access_token

request({
    url:url,
    method:"POST",
    headers:{
        "Authorization":auth
    },
    json:{

        "ShortCode":" ",
        "CommandID":"CustomerPayBillOnline",
        "Amount":"",
        "Msisdn":"",
        "BillRefNumber":""

    }
},
function(error,response,body){
if(error){
    console.log(error)
}
else{
    res.status(200).json(body)
}

}

)
 })

//lipa na mpesa STK PUSH
app.post('/stk',access,(req,res)=>{

    fs.readFile('items.json',(error,data)=>{
if(error){
    res.status(500).end()
}else{
    const itemsJson=JSON.parse(data)
    const itemsArray=items.json.TOUR
    let total=0  
    req.body.items.forEach(function(item){
        const itemJson=itemsArray.find(function(i){
            return i.id==item.id
        })
     const total=total + itemJson.price
    })

   
let endpoint=""
let auth="Bearer "+req.access_token
  //decided to define my own constant
 let datenow=new Date()
const timestamp=datenow.getFullYear()+""+""+datenow.getMonth()+""+""+datenow.getDate()+""+""+datenow.getHours()+""+""+datenow.getMinutes()+""+""+datenow.getSeconds()
const password=new Buffer.from(''+''+ timestamp).toString('base64')

request(
    {
url:endpoint,
method:"POST",
headers:{
    "Authorization":auth
},
json:{
"BusinessShortCode":"",
"Password":password,
"TimeStamp":timestamp,
"TransactionType":"",
"Amount":total,
"PartyA":"",
"PartyB":"",
"PhoneNumber":"",
"CallBackURL":"http://ipaddress/stk_callback",
"AccountReference":"",
"TransactionDesc":""

}
},
function(error,response,body){
if(error){
console.log(error)
}
res.status(200).json(body)
}

)
}

})          
})

app.post('/stk_callback',(req,res)=>{
    console.log('---------STK-----------')
    console.log(req.body.Body.stkCallback.CallbackMetadata)
})

//end of daraja

app.get('/store',function(req,res){
fs.readFile('items.json',function(error,data){ //reading our items.json
    if(error){
res.status(500).end()

    }else{
        res.render('store.ejs',{
            stripePublickey:stripePublickey, //sending stripepublic key from our server to store.js
            items:JSON.parse(data)
        })

    }
})

})

app.post('/purchase',function(req,res){
    fs.readFile('items.json',function(error,data){
        if(error){
    res.status(500).end()
    
        }else{
            const itemsJson=JSON.parse(data)
            const itemsArray=items.json.music.concat(items.json.merch)
            let total=0
            req.body.items.forEach(function(item){
const itemJson=itemsArray.find(function(i){

    return i.id == item.id
})
total=total + itemJson.price * item.quantity
            })
            
    stripe.charges.create({

        amount:total,
        source:req.body.stripe.tokenId,
        currency:'usd'
    }).then(function(){

        console.log('charges successful')
        res.json({message:'succefully purchased items'})
    }).catch(function(){
        console.log('charged failed')
        res.status(500).end()
    })

        }
    })
    
    })


app.listen(3000,function() {
    console.log('Server started at port 3000');
    });
    module.exports = app;