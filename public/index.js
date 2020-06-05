//import { access } from "fs"
//import { request } from "http"

 if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

//adding listners to the buttons
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('tour-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}
//using stripe when purchase button is clicked
/*var stripeHandler=StripeCheckout.configure({
    key: stripePublickey,
    locale:'en',
    token:function(token){
        var items=[]
        var cartItemsContainer=document.getElementsByClassName('cart-items')[0]
        var cartRows=cartItemContainer.getElementsByClassName('cart-row')
        for(var i=0;i<cartRows.length; i++){
            var cartRow=cartRows[i]
            var quantityElement=cartRow.getElementsByClassName('cart-quantity-input')[0]
            var quantity=quantityElement.value
            var id=cartRow.dataset.itemId
            items.push({
           id:id,
           quantity:quantity
    
            })
        }
     fetch('/purchase',{
         method:'POST',
         headers:{
             'Content-Type':'application/json',
             'Accept':'application/json'
    
         },
         body:JSON.stringify({
             stripesTokenId:token.id,
             items:items
         })
     }).then(function(res){
         return res.json()
     }).then(function(data){
         alert(data.message)
         var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    
     }).catch(function(error){
         console.error(error)
     })
    
    
    }
    
    });*/
    
    function purchaseClicked() {
        var priceElement=document.getElementsByClassName('cart-total-price')[0]
        var price=parseFloat(priceElement.innerText.replace('$',''))*100
        fetch('/purchase',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
       
            },
      //alert('Thank you for your purchase')
        //var cartItems = document.getElementsByClassName('cart-items')[0]
        //while (cartItems.hasChildNodes()) {
         //cartItems.removeChild(cartItems.firstChild)
        }
       // updateCartTotal()
        //var priceElement=document.getElementsByClassName('cart-total-price')[0]
        //var price=parseFloat(priceElement.innerText.replace('$',''))*100
        
        //stripeHandler.open
        //({
         //  amount:price
    )
        }

    function removeCartItem(event) {
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    }
    
    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        updateCartTotal()
    }    
    function addToCartClicked(event) {
        
        var button = event.target
        var tourItem = button.parentElement.parentElement
        var date = tourItem.getElementsByClassName('tour-item tour-date')[0].innerText
        var city = tourItem.getElementsByClassName('tour-item tour-city')[0].innerText
        var arena = tourItem.getElementsByClassName('tour-item tour-arena')[0].innerText
        var price = tourItem.getElementsByClassName('tour-item tour-price')[0].innerText
       var id=tourItem.dataset.itemId 
        addItemToCart(date,city,arena,price,id)
        updateCartTotal()
        alert('item added to cart succeful')
        
    }
    function addItemToCart(date,city,arena,price,id) {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        cartRow.dataset.itemId=id
        var cartItems = document.getElementsByClassName('cart-items')[0]
        var cartItemNames = cartItems.getElementsByClassName('cart-item-city')
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText == city) {
                alert('This item is already added to the cart')
                finish();
            }
        }
        var cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-city">${city}</span>
        </div>
        <span class="cart-date cart-column">${date}</span>
        <span class="cart-arena cart-column">${arena}</span>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
   // cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
       // var quantity = quantityElement.value
        total = total + price 
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}
