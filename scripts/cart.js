import { accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, updateCurrentData, gallery, returnUserList} from "./helpers.js"

// user existence confirmation
const userExistence = localStorage.getItem('user')
//? some user existence confirmed?
if(!userExistence){
    // if not user found, redirect to login
    window.location.href = '../pages/login.html'
}
// stock form html container
const stockForm = document.getElementById('stock-form')
// get accordion html containers (first & second)
const accordion = document.getElementById('accordionFlushExample')
const accordionTwo = document.getElementById('accordionFlushExample-2')
// confirm purchase button
const confirmButton = document.getElementById('confirm-button')
// empty cart botton
const emptyCartButton = document.getElementById('empty-cart')
// logout button
const logoutButton = document.getElementById('logout-button')
// delete account button
const deleteAccountButton = document.getElementById('delete-account-button')
// card text (extract every <p class="card-text"></p> tags) html elements
const cardTextList = document.querySelectorAll('.card-text')

// variables to be used
// current user and gallery
let user = returnUser()
let cart =  [...user.cart]
let collectedItems = [...user.collectedItems]
// total accumulated payment in the cart (counter)
let total = 0
cart.forEach(item => total += parseFloat(item.price))
// total acumulated items in the cart (counter)
let totalItems = 0
cart.forEach(item => totalItems += item.stock)
// total bought items (counter)
let collectionTotal = 0
collectedItems.forEach(item => collectionTotal += item.stock)

// user name html container
const userName = cardTextList[5]
userName.textContent = `User name - ${user.name}`
// total amount html container
const paymentCost = cardTextList[2]
paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
// total items html container
const selectedItems = cardTextList[3]
selectedItems.textContent = `Total selected items - ${totalItems}`
// user collected items html container
const gottenItems = cardTextList[7]
gottenItems.textContent = `Your items - ${collectionTotal}`
// enough user´s credit html container
const enoughCredit = cardTextList[1]
// date html container
const dateContainer = cardTextList[4]
// user balance html container
const cardTextFifth = cardTextList[0]
// user email html container
const userEmail = cardTextList[6]
userEmail.textContent = user.email
// img container
const img = document.querySelectorAll('img')[1]
img.src = user.img
// card title
const cardTitle = document.querySelector('h3')
cardTitle.textContent = user.username
// type user´s balance
cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
// write whether the user has sufficient credit to complete the purchase or not.
if(user.credit > total){
    enoughCredit.textContent = 'Enough credit'
    enoughCredit.classList.add('text-success')
}else{
    enoughCredit.innerHTML = 'Not enough credit'
    enoughCredit.classList.add('text-danger')
}
// type date based on string format
let date = new Date()
date = date.toISOString().split('T')[0]
dateContainer.textContent = date
// reset main content arrow function
const resetContent = () => {
    // update localStorage´s user and gallery values
    updateUser(user)
    updateCurrentData(gallery)
    // rewrite accordion items/content
    accordionContent(user.cart, accordion, accordionItem)
    accordionContent(user.collectedItems, accordionTwo, accordionSubItem)
    cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
    // reset the value of the `total` variable to 0 and iterate through the shopping cart once again, adding up item´s price
    total = 0
    user.cart.forEach(item => total += parseFloat(item.price))
    // update the payment cost display with the current total, formatting the number with commas for thousands (en-US style)
    paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
    // reset totalItems variable to 0 and iterate through the shopping cart once again, adding up item´s stock
    totalItems = 0
    user.cart.forEach(item => totalItems += item.stock)
    selectedItems.textContent = `Total selected items - ${totalItems}`
    // consider the possibility that before the current item was removed, the user's credit might not have been enough to cover all the items. Since an item was just removed, re-evaluate whether the user's credit is now greater than the total cost of all items.
    if(user.credit > total){
        // update the display to indicate that the user now has enough credit
        enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
    }
}
// write main data for accordion(s) html container based on user´s cart and collection items
accordionContent(cart, accordion, accordionItem)
accordionContent(collectedItems, accordionTwo, accordionSubItem)

// remove actually user credentials (logout action activated)
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('user')
    window.location.href = '../pages/login.html'
})
// delete user´s account
deleteAccountButton.addEventListener('click', () => {
    let usersArray = [...returnUserList()]
    usersArray = usersArray.filter(userInstance => userInstance.name != user.name)
    usersArray = JSON.stringify(usersArray)
    localStorage.setItem('users', usersArray)
    localStorage.removeItem('user')
    window.location.href = '../pages/login.html'
})
// purchase everything in the shopping cart, provided that the user has sufficient credit.
confirmButton.addEventListener('click', () => {
    // extract user, user´s shooping cart & user´s collected items variables
    user = returnUser()
    cart = [...user.cart]
    collectedItems = [...user.collectedItems]
    // reiterate user´s shooping cart to increase total´s value from 0 to las article´s price to consider whether the user´s is able to perform this action
    total = 0
    cart.forEach(item => total += parseFloat(item.price))
    // if the purchase is not possible, an alert will be shown to the user indicating that the total purchase cannot be completed because they do not have enough balance.
    if(user.credit < total){
        Swal.fire({
            title: '¡Not enough credit!',
            text: 'You cannot complete this purchase because your credit isn´t actually enough',
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }// alternatively, we carry out the action to update all necessary variables when purchasing the entire shopping cart.
    else{
        cart.forEach(cartItem => {
            // user´s balance is reduced by item´s price
            user.credit -= cartItem.price
            //? some coincidence into user´s collection for current item?
            const someItem = collectedItems.find(item => item.name == cartItem.name)
            //? if does, you will iterate over user´s collection items and increase current item´s stock from shooping cart item´s stock value and the user's balance is reduced by the price of the same item in the cart
            if(someItem){
                someItem.stock += cartItem.stock
            }// if you didn´t find any item from user´s collection, it means you have to add a new item for
            else{
                // remove item´s price, because it dosen´t need this one now you´ve gotten this product recently
                delete cartItem.price
                // update user´s collection adding the new item to the end of this list
                collectedItems.push(cartItem)
            }
        })
        // now you have gotten complete shooping cart, it´s time to assign your shooping cart an empty value
        user.cart = []
        // reset the content of these elements to their initial values, as if you were about to start a new shopping session from scratch.
        paymentCost.textContent = `Payment cost - $0`
        selectedItems.textContent = `Total selected items - 0`
        accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
        cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
        // total user´s collection items
        collectionTotal = 0
        collectedItems.forEach(item => collectionTotal += item.stock)
        gottenItems.textContent = `Your items - ${collectionTotal}`
        // update user´s collection & user
        user.collectedItems = collectedItems
        updateUser(user)
        // update the last accordion container content based on new collection added items
        accordionContent(collectedItems, accordionTwo, accordionSubItem)
        // notificate current user the current window has been updated succesfully
        Swal.fire({
            title: '!Correctly tranfer!',
            text: 'Your items will arrive soon!',
            icon: 'success',
            confirmButtonText: 'Ok',
        })
    }
})
// empty shoopoing cart
emptyCartButton.addEventListener('click', () => {
    // extract main user variable
    user = returnUser()
    // reset the content of these elements to their initial values, as if you were about to start a new shopping session from scratch.
    paymentCost.textContent = `Payment cost - $0`
    selectedItems.textContent = `Total selected items - 0`
    accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
    // 
    user.cart.forEach(cartItem => {
        // look for a match in the gallery array to see if there is any item with the same name as the current one.
        const coincidence = gallery.find(galleryItem => galleryItem.name == cartItem.name)
        //? some coincidence?, we have to iterate gallery array to locate same item and increase it´s stock value based on current cart item´s stock value
        if(coincidence){
            coincidence.stock += cartItem.stock
        }else{
            // item price
            let initPrice = cartItem.price
            // extract stock value from cart item
            const stock = cartItem.stock
            // divide its price by the number of times it was repeated
            initPrice = (initPrice/stock)
            // reassign it as the main value
            cartItem.price = initPrice
            // update gallery array
            gallery.push(cartItem)
        }
    })
    // succesfully update to gallery
    updateCurrentData(gallery)
    // reset user´s shooping cart and total variable to empty state
    user.cart = []
    total = 0
    // update to new user to local storage to keep permanent it´s change
    updateUser(user)
    // consider the possibility that before the current item was removed, the user's credit might not have been enough to cover all the items. Since an item was just removed, re-evaluate whether the user's credit is now greater than the total cost of all items.
    if(user.credit > total){
        // update the display to indicate that the user now has enough credit
        enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
    }
    // throw succesfully notification for current user
    Swal.fire({
        title: 'Empty cart',
        icon: 'info',
        confirmButtonText: 'Ok',
    })
})
// catch accordion click event
accordion.addEventListener('click', (e) => {
    // call user variable once gain
    user = returnUser()
    // get the text content of the element that triggered the click event
    const targetValue = e.target.textContent
    // get the third class name of the clicked element (index 2)
    const pk = e.target.classList[2]
    // find the first item in the user's shopping cart whose primary key matches the item's primary key
    const cartItem = user.cart.find(item => item.pk == pk)
    // divide the item’s price by its stock value (number of repetitions) to get its unit price or original value
    let itemPrice = (parseInt(cartItem.price)/parseInt(cartItem.stock))
    // assign current item´s stock value to stockItem variable
    let stockItem = cartItem.stock
    // try to find a match in the gallery array for an item whose name matches the current shooping cart item´s name
    const coincidence = gallery.find(item => item.name == cartItem.name)
    // youu wil perform the same action for user´s collection items
    const collectionCoincidence = user.collectedItems.find(item => item.name == cartItem.name)
    //? is the user trying to buy all items with an specific primary key?
    if(targetValue == 'Buy item(s)'){
        //? is the user´s available credit greater than or equal to the shooping cart´s item price?
        if(user.credit >= cartItem.price){
            // substract the cart´s item price from user´s credit
            user.credit -= cartItem.price
            // re-assign user´s shooping cart ignoring any item whose primary key matches to current item´s primary key
            user.cart = user.cart.filter(item => item.pk != pk)
            //? is there a match in the user's collection for the current item with the same name?
            if(collectionCoincidence){
                // just add cart item´s stock value to the match´s stock
                collectionCoincidence.stock += cartItem.stock
            }//? no match?
            else{
                // we dont´t already need its price because we just bought this item, so delete this property
                delete cartItem.price
                // add this item as a new one for user´s collection
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
    }//? is the user trying to buy only one unit?
    else if(targetValue == 'Buy item'){
        //? is the user´s available credit greater than or equal to the shooping cart´s item price?
        if(user.credit >= itemPrice){
            // substract item´s unit price to user´s credit
            user.credit -= itemPrice
            //? some collection´s match?
            if(collectionCoincidence){
                // add one to collection´s item stock value whose name matched to shooping cart´s item name
                collectionCoincidence.stock += 1
            } //? nothing match
            else{
                // extract one copy from cart item to avoid affect it to continue modifying it after perform the current action using applying spread method 
                const newItem = {...cartItem}
                // we dont´t already need its price because we just bought this item, so delete this property
                delete newItem.price
                // assign new item´s stock value to one unit
                newItem.stock = 1
                // add new item to user´s collection items
                user.collectedItems.push(newItem)
            }
            // substract one unit to current shooping cart´s item
            cartItem.stock -= 1
            // substract unit price value to current cart´s item
            cartItem.price -= itemPrice
            //? is it cart´s item stock value equal to 0 (it does not have more existences through gallery items)?
            if(cartItem.stock == 0){
                // filter new shooping cart ignoring any item whose primary key matches with current item´s primary key to avoid include it in hte new shooping cart
                user.cart = user.cart.filter(item => item.pk != pk)
            }
            resetContent()
        }// throw alert notification to user indicating there´s not enough credit to perform current action
        else{
            Swal.fire({
                title: '¡Not enough credit!',
                text: 'You don´t have enough credit to perform this action!',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }
    }//? is the user trying to delete only one unit?
    else if(targetValue == 'Remove item'){
        //? if a match exists?
        if(coincidence){
            // update the coincidence item increasing the gallery item's `stock` value by one
            coincidence.stock += 1
        }
        // if no match is found, it means we must add the current item as if it were a new one. Since the item in the cart has its price multiplied by the number of times it was meant to be repeated, we will obtain its original price by dividing its current price by its quantity, and then reset its stock to 1
        else{
            // extract one copy from user cart item to avoid affect it to continue modifying it after perform the current action using applying spread method
            const newItem = {...cartItem}
            // reassign it as the main value
            newItem.price = itemPrice
            // initialize the stock to 1
            newItem.stock = 1
            // add it to the gallery cart
            gallery.push(newItem)
        }
        //? we consider that if there is only one of these items left in the shopping cart and it is going to be removed, in that case we filter all the items in the cart again except for the one whose “primary key” matches that of the removed item
        if(stockItem == 1){
            user.cart = user.cart.filter(item => item.pk !== pk)
        }//? but if it is not yet the only item of its type, then we readjust its current price and subtract one repetition from its stock value
        else{
            cartItem.price -= itemPrice
            cartItem.stock -= 1
        }
        // call rest content arrow function
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
    //? is the user trying to delete all items with an specific primary key?
    }else if(targetValue == 'Delete item(s)'){
        //? existent match?
        if(coincidence){
            // update the coincidence found increasing the gallery item's `stock` value by one
            coincidence.stock += cartItem.stock
        }//? nothing match?
        else{
            // assign initial unit price to current item´s price value
            cartItem.price = itemPrice
            // add current item as a new one product to the market´s gallery
            gallery.push(cartItem)
        }
        user.cart = user.cart.filter(item => item.pk != pk)
        // call rest content arrow function
        resetContent()
    }
})