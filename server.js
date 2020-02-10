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
const fs=require('fs') //allows us to read different file in our case we reading the items.json
const stripe = require('stripe')(stripeSecretkey,stripePublickey)

app.set('view engine','ejs')
app.use(express.json())
app.use(express.static('public'))


app.get('/store',function(req,res){
fs.readFile('items.json',function(error,data){
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
            const itemsArray=items.Json.music.concat(itemsJson.merch)
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