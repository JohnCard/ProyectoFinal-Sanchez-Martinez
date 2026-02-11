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
//todo write main data for accordion(s) html container based on user´s cart and collection items
accordionContent(cart, accordion, accordionItem)
accordionContent(collectedItems, accordionTwo, accordionSubItem)
//! delete cart item function
const deleteItem = (item) => {
    //todo get current user's cart
    user = returnUser()
    cart = [...user.cart]
    //todo get "primary key" & "stock" from item keys
    const pk = item.pk
    const stock = item.stock
    //todo look for a match in the gallery array to see if there is any item with the same name as the current one.
    const coincidence = gallery.some(galleryItem => galleryItem.name == item.name)
    //? if a match exists, you will find and update the item whose name matches the current parameter we want to remove from the cart, increasing the gallery item's `stock` property by one.
    if(coincidence){
        gallery.forEach(galleryItem => {
            if(galleryItem.name == item.name){
                galleryItem.stock += 1
            }
        })
    }
    //todo if no match is found, it means we must add the current item as if it were a new one. Since the item in the cart has its price multiplied by the number of times it was meant to be repeated, we will obtain its original price by dividing its current price by its quantity, and then reset its stock to 1.
    else{
        //todo current item price
        let initPrice = item.price
        //todo divide its price by the number of times it was repeated
        initPrice = (initPrice/stock)
        //todo reassign it as the main value
        item.price = initPrice
        //todo initialize the stock to 1
        item.stock = 1
        //todo add it to the gallery cart
        gallery.push(item)
    }
    updateCurrentData(gallery)
    //! we consider that if there is only one of these items left in the shopping cart and it is going to be removed, in that case we filter all the items in the cart again except for the one whose “primary key” matches that of the removed item.
    if(stock == 1){
        cart = cart.filter(item => item.pk !== pk)
    }//todo but if it is not yet the only item of its type, then we readjust its current price and subtract one repetition from its stock value.
    else{
        cart.forEach(item => {
            if(item.pk == pk){
                //todo current item price
                let initPrice = item.price
                //todo divide its price by the number of times it was repeated
                initPrice = (initPrice/stock)
                //todo decrease the item's current price by the initial unit price
                item.price -= initPrice
                //todo reduce the item's stock by one unit
                item.stock -= 1
            }
        })
    }
    //todo rewrite accordion items/content
    accordionContent(cart, accordion, accordionItem)
    //* we then reset the value of the `total` variable to 0 so we can iterate through the shopping cart once again, adding up the price of each item, since the cart has been updated.
    //todo reset the value of the `total` variable to 0
    total = 0
    //todo iterate through the shopping cart once again, adding up item´s price
    cart.forEach(item => total += parseFloat(item.price))
    //todo update the payment cost display with the current total, formatting the number with commas for thousands (en-US style)
    paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
    //* we will do the same for the `totalItems` variable: reset it to 0, iterate through the cart again, and for each iteration, increase its value based on the `stock` of the current item.
    //todo reset to 0
    totalItems = 0
    //todo iterate through the shopping cart once again, adding up item´s stock
    cart.forEach(item => totalItems += item.stock)
    selectedItems.textContent = `Total selected items - ${totalItems}`
    //todo consider the possibility that before the current item was removed, the user's credit might not have been enough to cover all the items. Since an item was just removed, re-evaluate whether the user's credit is now greater than the total cost of all items.
    if(user.credit > total){
        //todo update the display to indicate that the user now has enough credit
        enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
    }
    //todo update localStorage´s user and reassign it´s shooping cart
    user.cart = cart
    updateUser(user)
}

//todo action to purchase everything in the shopping cart, provided that the user has sufficient credit.
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
//todo empty card button handling
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
    const targetValue = e.target.textContent
    if(targetValue == 'Buy item(s)'){
        const pk = e.target.classList[2]
        const cartItem = user.cart.find(item => item.pk == pk)
        user = returnUser()
        cart = [...user.cart]
        collectedItems = [...user.collectedItems]
        if(cartItem.price <= user.credit){
            user.credit -= cartItem.price
            user.cart = cart.filter(item => item.pk != pk)
            const coincidence = user.collectedItems.some(item => item.name == cartItem.name)
            if(coincidence){
                for(let item of user.collectedItems){
                    if(item.name == cartItem.name){
                        item.stock += cartItem.stock
                    }
                }
            }else{
                delete cartItem.price
                user.collectedItems.push(cartItem)
            }
            updateUser(user)
            collectedItems = user.collectedItems
            cart = user.cart
            accordionContent(collectedItems, accordionTwo, accordionSubItem)
            accordionContent(cart, accordion, accordionItem)
            total = 0
            cart.forEach(item => total += parseFloat(item.price))
            paymentCost.textContent = `Payment cost - $${total}`
            totalItems = 0
            cart.forEach(item => totalItems += item.stock)
            selectedItems.textContent = `Total selected items - ${totalItems}`
            cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
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
        const pk = e.target.classList[2]
        user = returnUser()
        cart = [...user.cart]
        collectedItems = [...user.collectedItems]
        const cartItem = {...cart.find(item => item.pk == pk)}
        let stockValue
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            let stockPrice = gallery.find(galleryItem => galleryItem.name == cartItem.name)
            stockPrice = stockPrice.price
            stockPrice = parseInt(stockPrice)
            stockPrice = stockPrice*stockValue
            if(user.credit >= stockPrice){
                cart.forEach(item => {
                    if(item.pk == pk){
                        item.stock -= stockValue
                        if(item.stock <= 0){
                            cart = cart.filter(item => item.pk != pk)
                            let itemPrice = gallery.find(galleryItem => galleryItem.name == item.name)
                            itemPrice = itemPrice.price
                            itemPrice = parseInt(itemPrice)
                            user.credit -= stockValue*itemPrice
                        }else{
                            let itemPrice = gallery.find(galleryItem => galleryItem.name == item.name)
                            itemPrice = itemPrice.price
                            itemPrice = parseInt(itemPrice)
                            item.price = itemPrice*item.stock
                            user.credit -= stockValue*itemPrice
                        }
                    }
                })
                const coincidence = collectedItems.some(item => item.name == cartItem.name)
                if(coincidence){
                    collectedItems.forEach(item => {
                        if(item.name == cartItem.name){
                            item.stock += stockValue
                        }
                    })
                }else if(stockValue){
                    let collectionItem = {...cartItem}
                    collectionItem.stock = stockValue
                    collectedItems.push(collectionItem)
                }
                total = 0
                cart.forEach(item => total += parseFloat(item.price))
                paymentCost.textContent = `Payment cost - $${total}`
                totalItems = 0
                cart.forEach(item => totalItems += item.stock)
                selectedItems.textContent = `Total selected items - ${totalItems}`
                cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
                accordionContent(collectedItems, accordionTwo, accordionSubItem)
                accordionContent(cart, accordion, accordionItem)
                user.cart = cart
                user.collectedItems = collectedItems
                updateUser(user)
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
        user = returnUser()
        cart = [...user.cart]
        collectedItems = [...user.collectedItems]
        const pk = e.target.classList[2]
        const findItem = {...cart.find(item => item.pk == pk)}
        let initPrice = findItem.price
        const stock = findItem.stock
        initPrice = parseInt(initPrice/stock)
        if(user.credit >= initPrice){
            user.credit -= initPrice
            const coincidence = collectedItems.some(item => item.name == findItem.name)
            if(coincidence){
                collectedItems.forEach(item => {
                    if(item.name == findItem.name){
                        item.stock += 1
                    }
                })
                user.collectedItems = collectedItems
            }else{
                delete findItem.price
                findItem.stock = 1
                user.collectedItems.push(findItem)
                console.log(user.collectedItems)
            }
            cart.forEach(item => {
                if(item.name == findItem.name){
                    item.stock -= 1
                    item.price -= initPrice
                    if(item.stock == 0){
                        cart = cart.filter(cartItem => cartItem.pk != item.pk)
                    }
                }
            })
            //todo
            total = 0
            cart.forEach(item => total += parseFloat(item.price))
            paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
            //todo
            totalItems = 0
            cart.forEach(item => totalItems += item.stock)
            selectedItems.textContent = `Total selected items - ${totalItems}`
            //todo Type user balance
            cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
            user.cart = cart
            updateUser(user)
            accordionContent(user.cart, accordion, accordionItem)
            accordionContent(user.collectedItems, accordionTwo, accordionSubItem)
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
        const pk = e.target.classList[2]
        const item = cart.find(item => item.pk == pk)
        deleteItem(item)
    }else if(targetValue == 'Remove item(s)'){
        user = returnUser()
        cart = [...user.cart]
        const pk = e.target.classList[2]
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            cart.forEach(item => {
                if(item.pk == pk){
                    let initPrice = item.price
                    const stock = item.stock
                    initPrice = (initPrice/stock)
                    item.stock -= stockValue
                    const coincidence = gallery.some(galleryItem => galleryItem.name == item.name)
                    if(coincidence){
                        gallery.forEach(galleryItem => {
                            if(galleryItem.name == item.name){
                                galleryItem.stock += stockValue
                            }
                        })
                    }else if(stockValue){
                        const newItem = {...item}
                        item.price -= initPrice*item.stock
                        newItem.price = initPrice
                        newItem.stock = stockValue
                        gallery.push(newItem)
                    }
                    if(item.stock <= 0){
                        cart = cart.filter(item => item.pk != pk)
                    }else{
                        let itemPrice = gallery.find(galleryItem => galleryItem.name == item.name)
                        itemPrice = itemPrice.price
                        itemPrice = parseInt(itemPrice)
                        item.price = itemPrice*item.stock
                    }
                }
            })
            updateCurrentData(gallery)
            accordionContent(cart, accordion, accordionItem)
            user.cart = cart
            updateUser(user)
            //todo
            total = 0
            cart.forEach(item => total += parseFloat(item.price))
            paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
            //todo
            totalItems = 0
            cart.forEach(item => totalItems += item.stock)
            selectedItems.textContent = `Total selected items - ${totalItems}`
            //todo
            if(user.credit > total){
                enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
            }
            stockForm.reset()
        })
    }else if(targetValue == 'Delete item(s)'){
        user = returnUser()
        cart = [...user.cart]
        const pk = e.target.classList[2]
        const findItem = cart.find(item => item.pk == pk)
        const coincidence = gallery.some(item => item.name == findItem.name)
        if(coincidence){
            gallery.forEach(item => {
                if(item.name == findItem.name){
                    item.stock += findItem.stock
                }
            })
            cart = cart.filter(item => item.pk != findItem.pk)
        }else{
            let initPrice = findItem.price
            const stock = findItem.stock
            initPrice = (initPrice/stock)
            findItem.price = initPrice
            gallery.push(findItem)
            cart = cart.filter(item => item.pk != findItem.pk)
        }
        accordionContent(cart, accordion, accordionItem)
        updateCurrentData(gallery)
        user.cart = cart
        updateUser(user)
        //todo
        total = 0
        cart.forEach(item => total += parseFloat(item.price))
        paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
        //todo
        totalItems = 0
        cart.forEach(item => totalItems += item.stock)
        selectedItems.textContent = `Total selected items - ${totalItems}`
        //todo
        if(user.credit > total){
            enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
        }
    }
})