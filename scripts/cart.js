import { accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, user, gallery} from "./helpers.js"

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
//todo User´s cart
let cart =  user.cart
let collectedItems = user.collected_items
//todo total payment
let total = 0
cart.forEach(item => total += parseFloat(item.fields.price))
//todo total items
let totalItems = 0
cart.forEach(item => totalItems += item.stock)
//todo total bought items
let collectionTotal = 0
collectedItems.forEach(item => collectionTotal += item.stock)
//todo card text elements
const cardTextList = document.querySelectorAll('.card-text')
//todo User name container
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
//todo empty cart botton
const emptyCartButton = document.getElementById('empty-cart')
//** Delete cart item
const deleteItem = (item) => {
    //todo Delete item from user´s cart
    const pk = item.pk
    const stock = item.stock
    if(stock == 1){
        cart = cart.filter(item => item.pk !== pk)
    }else{
        cart.forEach(item => {
            if(item.pk == pk){
                let initPrice = item.fields.price
                initPrice = (initPrice/stock)
                item.fields.price -= initPrice
                item.stock -= 1
            }
        })
    }
    //todo update localStorage´s user
    user.cart = cart
    localStorage.setItem('user', JSON.stringify(user))
    //todo Rewrite accordion items
    accordionContent(cart, accordion, accordionItem)
    //todo
    total = 0
    cart.forEach(item => total += parseFloat(item.fields.price))
    paymentCost.textContent = `Payment cost - $${total.toLocaleString('en-US')}`
    //todo
    let totalItems = 0
    cart.forEach(item => totalItems += item.stock)
    selectedItems.textContent = `Total selected items - ${totalItems}`
    //todo
    if(user.credit > total){
        enoughCredit.innerHTML = '<p class="card-text fs-5 text-success">Enough credit</p>'
    }
}
//todo wrtie main data for accordion container based on user´s cart items
accordionContent(cart, accordion, accordionItem)
accordionContent(collectedItems, accordionTwo, accordionSubItem)
//* Write user card data
//todo img
const img = document.querySelectorAll('img')[1]
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
//todo Confirm purchase button
const confirmButton = document.getElementById('confirm-button')
confirmButton.addEventListener('click', () => {
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
            const someItem = collectedItems.some(item => item.fields.name == cartItem.fields.name)
            if(someItem){
                collectedItems.forEach(userItem => {
                    const coincidence = userItem.fields.name == cartItem.fields.name
                    if(coincidence){
                        userItem.stock += cartItem.stock
                        userItem.fields.price += cartItem.fields.price
                    }
                })
            }
            else{
                delete cartItem.fields.price
                collectedItems.push(cartItem)
            }
        })
        user.cart = []
        cart = []
        total = 0
        paymentCost.textContent = `Payment cost - $0`
        selectedItems.textContent = `Total selected items - 0`
        accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
        //todo total bought items
        collectionTotal = 0
        collectedItems.forEach(item => collectionTotal += item.stock)
        gottenItems.textContent = `Your items - ${collectionTotal}`
        //todo update new user
        user.collected_items = collectedItems
        const newUser = JSON.stringify(user)
        localStorage.setItem('user', newUser)
        accordionContent(collectedItems, accordionTwo, accordionSubItem)
        Swal.fire({
            title: '!Correctly tranfer!',
            text: 'Your items will arrive soon!',
            icon: 'success',
            confirmButtonText: 'Ok',
        })
    }
})
//todo Empty card button handling
emptyCartButton.addEventListener('click', () => {
    accordion.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
    paymentCost.textContent = `Payment cost - $0`
    selectedItems.textContent = `Total selected items - 0`
    cart = []
    user.cart = cart
    const newUser = JSON.stringify(user)
    localStorage.setItem('user', newUser)
    Swal.fire({
            title: 'Empty cart',
            icon: 'info',
            confirmButtonText: 'Ok',
        })
})
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
//todo Catch accordion click event
accordion.addEventListener('click', (e) => {
    const targetValue = e.target.textContent
    if(targetValue == 'Buy item'){
        const pk = e.target.classList[2]
        const cartItem = user.cart.find(item => item.pk == pk)
        if(cartItem.fields.price <= user.credit){
            user.cart = cart.filter(item => item.pk != pk)
            const coincidence = user.collected_items.some(item => item.fields.name == cartItem.fields.name)
            user.credit -= cartItem.fields.price
            if(coincidence){
                for(let item of user.collected_items){
                    if(item.fields.name == cartItem.fields.name){
                        item.stock += cartItem.stock
                    }
                }
            }else{
                delete cartItem.fields.price
                user.collected_items.push(cartItem)
            }
            let newUser = JSON.stringify(user)
            localStorage.setItem('user', newUser)
            newUser = JSON.parse(newUser)
            const newCollection = newUser.collected_items
            const userCart = newUser.cart
            accordionContent(newCollection, accordionTwo, accordionSubItem)
            accordionContent(userCart, accordion, accordionItem)
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
        let letUser = returnUser()
        let userCart = [...letUser.cart]
        let collectedItems = [...letUser.collected_items]
        const cartItem = userCart.find(item => item.pk == pk)
        let stockValue
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            if(letUser.credit >= cartItem.fields.price){
                userCart.forEach(item => {
                    if(item.pk == pk){
                        item.stock -= (stockValue) ? stockValue : 0
                        if(item.stock <= 0){
                            userCart = userCart.filter(item => item.pk != pk)
                            let itemPrice = gallery.find(galleryItem => galleryItem.fields.name == item.fields.name)
                            itemPrice = itemPrice.fields.price
                            itemPrice = parseInt(itemPrice)
                            letUser.credit -= stockValue*itemPrice
                        }else{
                            let itemPrice = gallery.find(galleryItem => galleryItem.fields.name == item.fields.name)
                            itemPrice = itemPrice.fields.price
                            itemPrice = parseInt(itemPrice)
                            item.fields.price = itemPrice*item.stock
                            letUser.credit -= stockValue*itemPrice
                        }
                    }
                })
                const coincidence = collectedItems.some(item => item.fields.name == cartItem.fields.name)
                if(coincidence){
                    collectedItems.forEach(item => {
                        if(item.fields.name == cartItem.fields.name){
                            item.stock += (stockValue) ? stockValue : 0
                        }
                    })
                }else if(stockValue){
                    let collectionItem = {...cartItem}
                    collectionItem.stock = stockValue
                    collectedItems.push(collectionItem)
                }
                accordionContent(collectedItems, accordionTwo, accordionSubItem)
                accordionContent(userCart, accordion, accordionItem)
                letUser.cart = userCart
                letUser.collected_items = collectedItems
                updateUser(letUser)
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
        const pk = e.target.classList[2]
        let letUser = returnUser()
        let userCart = [...letUser.cart]
        let stockValue
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            stockValue = stockForm.stock.value
            stockValue = parseInt(stockValue)
            userCart.forEach(item => {
                if(item.pk == pk){
                    item.stock -= (stockValue) ? stockValue : 0
                    if(item.stock == 0){
                        userCart = userCart.filter(item => item.pk != pk)
                    }else{
                        let itemPrice = gallery.find(galleryItem => galleryItem.fields.name == item.fields.name)
                        itemPrice = itemPrice.fields.price
                        itemPrice = parseInt(itemPrice)
                        item.fields.price = itemPrice*item.stock
                    }
                }
            })
            accordionContent(userCart, accordion, accordionItem)
            letUser.cart = userCart
            updateUser(letUser)
            stockForm.reset()
        })
    }
})