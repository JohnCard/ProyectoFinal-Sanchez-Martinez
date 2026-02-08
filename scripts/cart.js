import { accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, updateCurrentData, gallery} from "./helpers.js"

//todo user existence confirmation
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    const userExistence = localStorage.getItem('user')
    if(!userExistence){
        Swal.fire({
            title: '¡Not user found!',
            text: 'There is not existent user, redirect to login window or create your own account',
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
//todo stock for mcontainer
const stockForm = document.getElementById('stock-form')
//todo get accordion html containers
const accordion = document.getElementById('accordionFlushExample')
const accordionTwo = document.getElementById('accordionFlushExample-2')
//todo current user´s gallery
let user = returnUser()
let cart =  [...user.cart]
let collectedItems = [...user.collectedItems]
//todo total payment
let total = 0
cart.forEach(item => total += parseFloat(item.price))
//todo total items
let totalItems = 0
cart.forEach(item => totalItems += item.stock)
//todo total bought items
let collectionTotal = 0
collectedItems.forEach(item => collectionTotal += item.stock)
//todo card text elements
const cardTextList = document.querySelectorAll('.card-text')
//todo user name container
const userName = cardTextList[5]
//todo total amount html container
const paymentCost = cardTextList[2]
//todo total items html container
const selectedItems = cardTextList[3]
//todo user items html container
const gottenItems = cardTextList[7]
//todo enough user´s credit html container
const enoughCredit = cardTextList[1]
//todo date html container
const dateContainer = cardTextList[4]
//todo user balance html container
const cardTextFifth = cardTextList[0]
//todo User email html container
const userEmail = cardTextList[6]
//todo img container
const img = document.querySelectorAll('img')[1]
//todo empty cart botton
const emptyCartButton = document.getElementById('empty-cart')
//* Write user card data
//todo img
img.src = user.img
//todo card title
const cardTitle = document.querySelector('h3')
cardTitle.textContent = user.username
//todo
paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
//todo
selectedItems.textContent = `Total selected items - ${totalItems}`
//todo Type user balance
cardTextFifth.textContent = `User´s balance - $ ${(user.credit).toLocaleString('es-US')}`
//? enoguht user´s balance
if(user.credit > total){
    enoughCredit.textContent = 'Enough credit'
    enoughCredit.classList.add('text-success')
}else{
    enoughCredit.innerHTML = 'Not enough credit'
    enoughCredit.classList.add('text-danger')
}
//todo type date string format
let date = new Date()
date = date.toISOString().split('T')[0]
dateContainer.textContent = date
//todo type name
userName.textContent = `User name - ${user.name}`
//todo type user´s email
userEmail.textContent = user.email
//todo total gotten items
gottenItems.textContent = `Your items - ${collectionTotal}`
//todo wrtie main data for accordion container based on user´s cart items
accordionContent(cart, accordion, accordionItem)
accordionContent(collectedItems, accordionTwo, accordionSubItem)
//** Delete cart item function
const deleteItem = (item) => {
    user = returnUser()
    cart = [...user.cart]
    //todo Delete item from user´s cart
    const pk = item.pk
    const stock = item.stock
    const coincidence = gallery.some(galleryItem => galleryItem.name == item.name)
    if(coincidence){
        gallery.forEach(galleryItem => {
            if(galleryItem.name == item.name){
                galleryItem.stock += 1
            }
        })
    }
    else{
        let initPrice = item.price
        initPrice = (initPrice/stock)
        item.price = initPrice
        item.stock = 1
        gallery.push(item)
    }
    updateCurrentData(gallery)
    if(stock == 1){
        cart = cart.filter(item => item.pk !== pk)
    }else{
        cart.forEach(item => {
            if(item.pk == pk){
                let initPrice = item.price
                initPrice = (initPrice/stock)
                item.price -= initPrice
                item.stock -= 1
            }
        })
    }
    //todo Rewrite accordion items
    accordionContent(cart, accordion, accordionItem)
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
    //todo update localStorage´s user
    user.cart = cart
    updateUser(user)
}
//todo Confirm purchase button
const confirmButton = document.getElementById('confirm-button')
confirmButton.addEventListener('click', () => {
    user = returnUser()
    cart = [...user.cart]
    collectedItems = [...user.collectedItems]
    if(user.credit < total){
        Swal.fire({
            title: '¡Not enough credit!',
            text: 'You cannot complete this purchase because your credit isn´t actually enough',
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }
    else{
        cart.forEach(cartItem => {
            const someItem = collectedItems.some(item => item.name == cartItem.name)
            if(someItem){
                collectedItems.forEach(userItem => {
                    if(userItem.name == cartItem.name){
                        userItem.stock += cartItem.stock
                        user.credit -= cartItem.price
                    }
                })
            }
            else{
                user.credit -= cartItem.price
                delete cartItem.price
                collectedItems.push(cartItem)
            }
        })
        user.cart = []
        paymentCost.textContent = `Payment cost - $0`
        selectedItems.textContent = `Total selected items - 0`
        accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
        //todo total bought items
        collectionTotal = 0
        collectedItems.forEach(item => collectionTotal += item.stock)
        gottenItems.textContent = `Your items - ${collectionTotal}`
        //todo update new user
        user.collectedItems = collectedItems
        updateUser(user)
        accordionContent(collectedItems, accordionTwo, accordionSubItem)
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
    user = returnUser()
    paymentCost.textContent = `Payment cost - $0`
    selectedItems.textContent = `Total selected items - 0`
    accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
    gallery.forEach(item => {
        user.cart.forEach(itemCart => {
            if(itemCart.name == item.name){
                item.stock += itemCart.stock
            }
        })
    })
    updateCurrentData(gallery)
    user.cart = []
    updateUser(user)
    Swal.fire({
            title: 'Empty cart',
            icon: 'info',
            confirmButtonText: 'Ok',
        })
})
//todo catch accordion click event
accordion.addEventListener('click', (e) => {
    const targetValue = e.target.textContent
    if(targetValue == 'Buy item'){
        const pk = e.target.classList[2]
        const cartItem = user.cart.find(item => item.pk == pk)
        user = returnUser()
        cart = [...user.cart]
        collectedItems = [...user.collectedItems]
        if(cartItem.price <= user.credit){
            user.cart = cart.filter(item => item.pk != pk)
            user.credit -= cartItem.price
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
    }
    else if(targetValue == 'Choose amount'){
        const pk = e.target.classList[2]
        user = returnUser()
        cart = [...user.cart]
        collectedItems = [...user.collectedItems]
        const cartItem = cart.find(item => item.pk == pk)
        let stockValue
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            if(user.credit >= cartItem.price){
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
    }
    else if(targetValue == 'Remove item'){
        const pk = e.target.id
        const item = cart.find(item => item.pk == pk)
        deleteItem(item)
    }
    else if(targetValue == 'Remove item(s)'){
        user = returnUser()
        cart = [...user.cart]
        const pk = e.target.classList[2]
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            cart.forEach(item => {
                if(item.pk == pk){
                    item.stock -= stockValue
                    const coincidence = gallery.some(galleryItem => galleryItem.name == item.name)
                    if(coincidence){
                        gallery.forEach(galleryItem => {
                            if(galleryItem.name == item.name){
                                galleryItem.stock += stockValue
                            }
                        })
                    }else{
                        const newItem = {...item}
                        let initPrice = item.price
                        const stock = item.stock
                        initPrice = (initPrice/stock)
                        item.price -= initPrice*stockValue
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
            stockForm.reset()
        })
    }
})