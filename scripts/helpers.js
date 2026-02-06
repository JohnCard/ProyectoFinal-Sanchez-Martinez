//todo main gallery
let gallery = localStorage.getItem('gallery')
gallery = JSON.parse(gallery)
//todo pull user object from localStorage and convert to object format
let user = localStorage.getItem('user')
user = JSON.parse(user)
//todo pull item´s stock property from alert
const stockForm = document.getElementById('stock-form')
//* Additional functions
//todo Save default data
const saveGalleryData = () => {
    fetch('product.json')
        .then(res => res.json())
        .then(data => {
            const stringFormat = JSON.stringify(data)
            localStorage.setItem('gallery', stringFormat)
        });
}
//todo Delete default data
const deleteGalleryData = () => {
    localStorage.removeItem('gallery')
}
//todo Save default user
const saveDefaultUser = () => {
    fetch('user.json')
        .then(res => res.json())
        .then(data => {
            const stringFormat = JSON.stringify(data)
            localStorage.setItem('user', stringFormat)
        });
}
//todo Delete default user
const deleteDefaultUser = () => {
    localStorage.removeItem('user')
}
//todo udd user
const addUser = (user) => {
    let userArray = localStorage.getItem('users')
    userArray = JSON.parse(userArray)
    userArray.push(user)
    userArray = JSON.stringify(userArray)
    localStorage.setItem('users', userArray)
}
//todo user array
const returnUserList = () => {
    let userArray = localStorage.getItem('users')
    userArray = JSON.parse(userArray)
    return userArray
}
//todo get user
const returnUser = () => {
    let returnedUser = localStorage.getItem('user')
    returnedUser = JSON.parse(returnedUser)
    return returnedUser
}
//todo updated user
const updateUser = (user) => {
    const newUser = JSON.stringify(user)
    localStorage.setItem('user', newUser)
}
//todo return user´s values
const userData = (user) => {
    const constUser = {...user}
    //todo username
    let username = user.username
    //todo name
    let name = user.name
    //todo email
    let email = user.email
    //todo user cart & collection
    let userCart = {...constUser.cart}
    let collectedItems = {...constUser.collected_items}
    //todo total payment
    let total = 0
    userCart.forEach(item => total += parseFloat(item.fields.price))
    //todo total items
    let totalItems = 0
    userCart.forEach(item => totalItems += item.stock)
    //todo total bought items
    let collectionTotal = 0
    collectedItems.forEach(item => collectionTotal += item.stock)
    //todo user img
    let img = user.img
    return {username, name, email, credit, userCart, collectedItems, total, totalItems, collectionTotal, img}
}
//* Add item to user´s cart
const addItem = (item, targetElement) => {
    //todo spread new item
    const newItem = {...item}
    let itemPrice = newItem.fields.price
    let letUser = returnUser()
    const userCart = [...letUser.cart]
    let stockValue
    stockForm.addEventListener('submit', (e) => {
        e.preventDefault()
        stockValue = stockForm.stock.value
        stockValue = parseInt(stockValue)
        //todo verify the item’s existence in the user’s cart checking the user´s cart & based on item´s name
        let someItem = userCart.some(item => item.fields.name == newItem.fields.name)
        //? item exist this at user cart
        if(someItem){
            for(item of userCart){
                if(item.fields.name == newItem.fields.name){
                    item.stock += (stockValue) ? stockValue : 0
                    item.fields.price = (stockValue) ? itemPrice*item.stock : item.fields.price
                    const divParent = targetElement.closest('div')
                    const stockContainer = divParent.children[2]
                    stockContainer.textContent = `Stock cart - ${item.stock}`
                }
            }
            letUser.cart = userCart
            updateUser(letUser)
        }
        else{
            if(stockValue){
                //todo Prepare user object to set local storage
                newItem.pk = crypto.randomUUID()
                delete newItem.model
                newItem.stock = stockValue
                newItem.fields.price = stockValue*itemPrice
                const divParent = targetElement.closest('div')
                const stockContainer = divParent.children[2]
                stockContainer.textContent = `Stock cart - ${stockValue}`
                //todo Append for user cart
                userCart.push(newItem)
                letUser.cart = userCart
                //todo Update user
                updateUser(letUser)
            }
        }
        stockForm.reset()
    })
}
//* Catching click
const click = (element, arrowF, arraySearch) => {
    element.addEventListener('click', (e) => {
        const tagContent = e.target.textContent
        if(tagContent == 'Add to cart'){
            const pk = e.target.id
            const item = arraySearch.find(item => item.pk == pk)
            arrowF(item, e.target)
        }
        else{
            const pk = e.target.classList[2]
            const item = arraySearch.find(item => item.pk == pk)
            let price = item.fields.price
            price = parseInt(price)
            let letUser = returnUser()
            const userCart = [...letUser.cart]
            const coincidence = userCart.some(itemCart => itemCart.fields.name == item.fields.name)
            if(coincidence){
                userCart.forEach(itemCart => {
                    if(itemCart.fields.name == item.fields.name){
                        itemCart.stock += 1
                        itemCart.fields.price += price
                        const button = e.target
                        const divParent = button.closest('div')
                        const stockContainer = divParent.children[2]
                        stockContainer.textContent = `Stock cart - ${itemCart.stock}`
                    }
                })
                letUser.cart = userCart
                updateUser(letUser)
            }
            else{
                item.pk = crypto.randomUUID()
                delete item.model
                item.stock = 1
                item.fields.price = parseInt(item.fields.price)
                const button = e.target
                const divParent = button.closest('div')
                const stockContainer = divParent.children[2]
                stockContainer.textContent = `Stock cart - ${item.stock}`
                userCart.push(item)
                letUser.cart = userCart
                updateUser(letUser)
            }
        }
    });
}
//* HMTL components
//todo card html
const cardItem = (item, stockCart=0) => {
    return `<div class="col-sm-6 col-lg-4 col-xxl-3 mb-3">
                <div class="card">
                    <img src=${item.fields.img} class="card-img-top py-3 px-5" alt="${item.fields.slug}-image" height="180">
                    <div class="card-body">
                        <h5 class="card-title">${item.fields.name}</h5>
                        <p class="card-text">Price - $${Number(item.fields.price).toLocaleString('en-US')}</p>
                        <p class="card-text">Stock cart - ${stockCart}</p>
                        <p class="card-text min-h-50">Categories - ${(item.fields.categories).join(', ')}</p>
                        <p class="card-text min-h-50">Brand - ${item.fields.brand}</p>
                        <h5 class="card-subtitle">About item</h5>
                        <p class="card-text">${item.fields.description.slice(0, 120)}...</p>
                        <button class="btn btn-primary me-3" id="${item.pk}" data-bs-target="#exampleModal" data-bs-toggle="modal">Add to cart</button>
                        <button class="btn btn-primary ${item.pk}">Add one item</button>
                    </div>
                </div>
        </div>`
}
//todo accordion item html
const accordionItem = (item, state='') => {
    return `<div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed bg-secondary-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${item.pk}" aria-expanded="false" aria-controls="flush-collapse${item.pk}" id="accordion-button-${item.pk}">
                ${item.fields.name}
            </button>
        </h2>
        <div id="flush-collapse${item.pk}" class="accordion-collapse collapse ${state}" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body bg-dark-subtle">
                <p class="text-bg-light p-3">${item.fields.description}</p>
                <p class="text-bg-light p-3 w-75">Categories - ${(item.fields.categories).join(', ')}</p>
                <p class="text-bg-light p-3 w-75">Brand - ${item.fields.brand}</p>
                <p class="text-bg-light p-3 w-50">Price - $${Number(item.fields.price).toLocaleString('en-US')}</p>
                <p class="text-bg-light p-3 w-25">Stock - ${item.stock}</p>
                <button class="btn btn-danger" id=${item.pk}>Remove item</button>
                <button class="btn btn-warning ${item.pk}" data-bs-target="#exampleModal" data-bs-toggle="modal">Remove item(s)</button>
                <button class="btn btn-success ${item.pk}">Buy item</button>
                <button class="btn btn-primary ${item.pk}" data-bs-target="#exampleModal" data-bs-toggle="modal">Choose amount</button>
            </div>
        </div>
    </div>`
}
//todo accordion sub item html
const accordionSubItem = (item, state='') => {
    return `<div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed bg-secondary-subtle " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${item.pk}" aria-expanded="false" aria-controls="flush-collapse${item.pk}" id="sub-accordion-button-${item.pk}">
                ${item.fields.name}
            </button>
        </h2>
        <div id="flush-collapse${item.pk}" class="accordion-collapse collapse ${state}" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body bg-dark-subtle">
                <p class="text-bg-light p-3">${item.fields.description}</p>
                <p class="text-bg-light p-3 w-75">Categories - ${(item.fields.categories).join(', ')}</p>
                <p class="text-bg-light p-3 w-75">Brand - ${item.fields.brand}</p>
                <p class="text-bg-light p-3 w-25">Stock - ${item.stock}</p>
            </div>
        </div>
    </div>`
}
//* Wrtie an accordion main content
const accordionContent = (listItems, accordionRef, htmlItem) => {
    if(listItems.length > 0){
        accordionRef.innerHTML = ''
        listItems.forEach((item, index) => {
            if (index === 0) {
                accordionRef.innerHTML += htmlItem(item, 'show')
            }
            else{
                accordionRef.innerHTML += htmlItem(item)
            }
        })
    }
    else{
        accordionRef.innerHTML = '<h2 class="text-warning">Not selected items yet.</h2>'
    }
}

export {saveGalleryData, deleteGalleryData, saveDefaultUser, deleteDefaultUser, cardItem, addItem, click, accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, userData, addUser, returnUserList, gallery, user, stockForm}