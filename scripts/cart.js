import { accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, updateCurrentData, gallery} from "./helpers.js"

//todo user existence confirmation
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    const userExistence = localStorage.getItem('user')
    if(!userExistence){
        Swal.fire({
            title: '¡Not user found!',
            text: 'There is not existent user, redirect to login window or create your own account and login',
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }else{
        Toastify({
            text: 'User found',
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'green',
        }).showToast();
    }
})
//todo stock form html container
const stockForm = document.getElementById('stock-form')
//todo get accordion html containers (first & second)
const accordion = document.getElementById('accordionFlushExample')
const accordionTwo = document.getElementById('accordionFlushExample-2')
//todo confirm purchase button
const confirmButton = document.getElementById('confirm-button')
//todo empty cart botton
const emptyCartButton = document.getElementById('empty-cart')
//todo card text (extract every <p class="card-text"></p> tags) html elements
const cardTextList = document.querySelectorAll('.card-text')

//* variables to be used
//todo current user and gallery
let user = returnUser()
let cart =  [...user.cart]
let collectedItems = [...user.collectedItems]
//todo total accumulated payment in the cart (counter)
let total = 0
cart.forEach(item => total += parseFloat(item.price))
//todo total acumulated items in the cart (counter)
let totalItems = 0
cart.forEach(item => totalItems += item.stock)
//todo total bought items (counter)
let collectionTotal = 0
collectedItems.forEach(item => collectionTotal += item.stock)

//todo user name html container
const userName = cardTextList[5]
userName.textContent = `User name - ${user.name}`
//todo total amount html container
const paymentCost = cardTextList[2]
paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
//todo total items html container
const selectedItems = cardTextList[3]
selectedItems.textContent = `Total selected items - ${totalItems}`
//todo user collected items html container
const gottenItems = cardTextList[7]
gottenItems.textContent = `Your items - ${collectionTotal}`
//todo enough user´s credit html container
const enoughCredit = cardTextList[1]
//todo date html container
const dateContainer = cardTextList[4]
//todo user balance html container
const cardTextFifth = cardTextList[0]
//todo user email html container
const userEmail = cardTextList[6]
userEmail.textContent = user.email
//todo img container
const img = document.querySelectorAll('img')[1]
img.src = user.img
//todo card title
const cardTitle = document.querySelector('h3')
cardTitle.textContent = user.username
//todo type user´s balance
cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
//todo write whether the user has sufficient credit to complete the purchase or not.
if(user.credit > total){
    enoughCredit.textContent = 'Enough credit'
    enoughCredit.classList.add('text-success')
}else{
    enoughCredit.innerHTML = 'Not enough credit'
    enoughCredit.classList.add('text-danger')
}
//todo type date based on string format
let date = new Date()
date = date.toISOString().split('T')[0]
dateContainer.textContent = date
//* reset main content
const resetContent = () => {
    //todo update localStorage´s user and gallery values
    updateUser(user)
    updateCurrentData(gallery)
    //todo rewrite accordion items/content
    accordionContent(user.cart, accordion, accordionItem)
    accordionContent(user.collectedItems, accordionTwo, accordionSubItem)
    cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
    //todo reset the value of the `total` variable to 0 and iterate through the shopping cart once again, adding up item´s price
    total = 0
    user.cart.forEach(item => total += parseFloat(item.price))
    //todo update the payment cost display with the current total, formatting the number with commas for thousands (en-US style)
    paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
    //todo reset totalItems variable to 0 and iterate through the shopping cart once again, adding up item´s stock
    totalItems = 0
    user.cart.forEach(item => totalItems += item.stock)
    selectedItems.textContent = `Total selected items - ${totalItems}`
    //todo consider the possibility that before the current item was removed, the user's credit might not have been enough to cover all the items. Since an item was just removed, re-evaluate whether the user's credit is now greater than the total cost of all items.
    if(user.credit > total){
        //todo update the display to indicate that the user now has enough credit
        enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
    }
}
//todo write main data for accordion(s) html container based on user´s cart and collection items
accordionContent(cart, accordion, accordionItem)
accordionContent(collectedItems, accordionTwo, accordionSubItem)

//todo purchase everything in the shopping cart, provided that the user has sufficient credit.
confirmButton.addEventListener('click', () => {
    //todo extract user, user´s shooping cart & user´s collected items variables
    user = returnUser()
    cart = [...user.cart]
    collectedItems = [...user.collectedItems]
    //todo reiterate user´s shooping cart to increase total´s value from 0 to las article´s price to consider whether the user´s is able to perform this action
    total = 0
    cart.forEach(item => total += parseFloat(item.price))
    //! if the purchase is not possible, an alert will be shown to the user indicating that the total purchase cannot be completed because they do not have enough balance.
    if(user.credit < total){
        Swal.fire({
            title: '¡Not enough credit!',
            text: 'You cannot complete this purchase because your credit isn´t actually enough',
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }//todo alternatively, we carry out the action to update all necessary variables when purchasing the entire shopping cart.
    else{
        cart.forEach(cartItem => {
            //todo user´s balance is reduced by item´s price
            user.credit -= cartItem.price
            //? some coincidence into user´s collection for current item?
            const someItem = collectedItems.some(item => item.name == cartItem.name)
            //? if does, you will iterate over user´s collection items and increase current item´s stock from shooping cart item´s stock value and the user's balance is reduced by the price of the same item in the cart
            if(someItem){
                collectedItems.forEach(userItem => {
                    if(userItem.name == cartItem.name){
                        //todo increase user´s item from cart´s item stock
                        userItem.stock += cartItem.stock
                    }
                })
            }//todo if you didn´t find any item from user´s collection, it means you have to add a new item for
            else{
                //! remove item´s price, because it dosen´t need this one now you´ve gotten this product recently
                delete cartItem.price
                //* update user´s collection adding the new item to the end of this list
                collectedItems.push(cartItem)
            }
        })
        //todo now you have gotten complete shooping cart, it´s time to assign your shooping cart an empty value
        user.cart = []
        //* reset the content of these elements to their initial values, as if you were about to start a new shopping session from scratch.
        paymentCost.textContent = `Payment cost - $0`
        selectedItems.textContent = `Total selected items - 0`
        accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
        cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
        //todo total user´s collection items
        collectionTotal = 0
        collectedItems.forEach(item => collectionTotal += item.stock)
        gottenItems.textContent = `Your items - ${collectionTotal}`
        //todo update user´s collection & user
        user.collectedItems = collectedItems
        updateUser(user)
        //todo update the last accordion container content based on new collection added items
        accordionContent(collectedItems, accordionTwo, accordionSubItem)
        //* notificate current user the current window has been updated succesfully
        Swal.fire({
            title: '!Correctly tranfer!',
            text: 'Your items will arrive soon!',
            icon: 'success',
            confirmButtonText: 'Ok',
        })
    }
})
//todo empty shoopoing cart
emptyCartButton.addEventListener('click', () => {
    //todo extract main user variable
    user = returnUser()
    //* reset the content of these elements to their initial values, as if you were about to start a new shopping session from scratch.
    paymentCost.textContent = `Payment cost - $0`
    selectedItems.textContent = `Total selected items - 0`
    accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
    //* 
    user.cart.forEach(cartItem => {
        //todo look for a match in the gallery array to see if there is any item with the same name as the current one.
        const coincidence = gallery.some(galleryItem => galleryItem.name == cartItem.name)
        //? some coincidence?, we have to iterate gallery array to locate same item and increase it´s stock value based on current cart item´s stock value
        if(coincidence){
            gallery.forEach(item => {
                if(cartItem.name == item.name){
                    item.stock += cartItem.stock
                }
            })
        }else{
            //todo item price
            let initPrice = cartItem.price
            //todo extract stock value from cart item
            const stock = cartItem.stock
            //todo divide its price by the number of times it was repeated
            initPrice = (initPrice/stock)
            //todo reassign it as the main value
            cartItem.price = initPrice
            //todo update gallery array
            gallery.push(cartItem)
        }
    })
    //* succesfully update to gallery
    updateCurrentData(gallery)
    //* reset user´s shooping cart to empty state
    user.cart = []
    //* update to new user to local storage to keep permanent it´s change
    updateUser(user)
    //* throw succesfully notification for current user
    Swal.fire({
        title: 'Empty cart',
        icon: 'info',
        confirmButtonText: 'Ok',
    })
})
//todo catch accordion click event
accordion.addEventListener('click', (e) => {
    //todo get the text content of the element that triggered the click event
    const targetValue = e.target.textContent
    const pk = e.target.classList[2]
    user = returnUser()
    const cartItem = user.cart.find(item => item.pk == pk)
    let itemPrice = (parseInt(cartItem.price)/parseInt(cartItem.stock))
    let stockItem = parseInt(cartItem.stock)
    const coincidence = gallery.find(item => item.name == cartItem.name)
    const collectionCoincidence = user.collectedItems.find(item => item.name == cartItem.name)
    //? is the user trying to buy everything?
    if(targetValue == 'Buy item(s)'){
        if(cartItem.price <= user.credit){
            user.credit -= cartItem.price
            user.cart = user.cart.filter(item => item.pk != pk)
            if(collectionCoincidence){
                collectionCoincidence.stock += cartItem.stock
            }else{
                delete cartItem.price
                user.collectedItems.push(cartItem)
            }
            resetContent()
            Swal.fire({
                title: '!Performed action!',
                text: 'Your movement was performed correctly!',
                icon: 'success',
                confirmButtonText: 'Ok',
            })
        }else{
            Swal.fire({
                title: '¡Not enough credit!',
                text: 'You don´t have enough credit to perform this action!',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }
    }else if(targetValue == 'Choose amount'){
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            stockValue = (stockValue < stockItem) ? stockValue : stockItem
            let stockPrice = itemPrice*stockValue
            if(user.credit >= stockPrice){
                cartItem.stock -= stockValue
                user.credit -= stockPrice
                if(cartItem.stock <= 0){
                    user.cart = user.cart.filter(item => item.pk != pk)
                }else{
                    cartItem.price = itemPrice*cartItem.stock
                }
                if(collectionCoincidence){
                    collectionCoincidence.stock += stockValue
                }else if(stockValue){
                    const newItem = {...cartItem}
                    newItem.stock = stockValue
                    user.collectedItems.push(newItem)
                }
                resetContent()
                stockForm.reset()
                Swal.fire({
                    title: '!Performed action!',
                    text: 'Your movement was performed correctly!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                })
            }else{
                Swal.fire({
                    title: '¡Not enough credit!',
                    text: 'You don´t have enough credit to perform this action!',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                })
            }
        })
    }else if(targetValue == 'Buy item'){
        if(user.credit >= itemPrice){
            user.credit -= itemPrice
            if(collectionCoincidence){
                collectionCoincidence.stock += 1
            }else{
                const newItem = {...cartItem}
                delete newItem.price
                newItem.stock = 1
                user.collectedItems.push(newItem)
            }
            cartItem.stock -= 1
            cartItem.price -= itemPrice
            if(cartItem.stock == 0){
                user.cart = user.cart.filter(item => item.pk != pk)
            }
            resetContent()
        }else{
            Swal.fire({
                title: '¡Not enough credit!',
                text: 'You don´t have enough credit to perform this action!',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }
    }
    else if(targetValue == 'Remove item'){
        //? if a match exists, you will find and update the item whose name matches the current parameter we want to remove from the cart, increasing the gallery item's `stock` property by one.
        if(coincidence){
            coincidence.stock += 1
        }
        //todo if no match is found, it means we must add the current item as if it were a new one. Since the item in the cart has its price multiplied by the number of times it was meant to be repeated, we will obtain its original price by dividing its current price by its quantity, and then reset its stock to 1.
        else{
            const newItem = {...cartItem}
            //todo reassign it as the main value
            newItem.price = itemPrice
            //todo initialize the stock to 1
            newItem.stock = 1
            //todo add it to the gallery cart
            gallery.push(newItem)
        }
        //! we consider that if there is only one of these items left in the shopping cart and it is going to be removed, in that case we filter all the items in the cart again except for the one whose “primary key” matches that of the removed item.
        if(stockItem == 1){
            user.cart = user.cart.filter(item => item.pk !== pk)
        }//todo but if it is not yet the only item of its type, then we readjust its current price and subtract one repetition from its stock value.
        else{
            cartItem.price -= itemPrice
            cartItem.stock -= 1
        }
        resetContent()
    }else if(targetValue == 'Remove item(s)'){
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            stockValue = (stockValue < cartItem.stock) ? stockValue : cartItem.stock
            if(coincidence){
                coincidence.stock += stockValue
            }else if(stockValue){
                let newItem = {...cartItem}
                newItem.price = itemPrice
                newItem.stock = stockValue
                gallery.push(newItem)
            }
            cartItem.stock -= stockValue
            if(cartItem.stock <= 0){
                user.cart = user.cart.filter(item => item.pk != pk)
            }else{
                cartItem.price -= itemPrice*stockValue
            }
            resetContent()
            stockForm.reset()
        })
    }else if(targetValue == 'Delete item(s)'){
        if(coincidence){
            coincidence.stock += cartItem.stock
        }else{
            cartItem.price = itemPrice
            gallery.push(cartItem)
        }
        user.cart = user.cart.filter(item => item.pk != pk)
        resetContent()
    }
})