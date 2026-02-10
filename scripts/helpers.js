import { Item } from "./models.js"

//todo row div html element
const row = document.querySelector('.row')
//todo main gallery
let gallery = localStorage.getItem('gallery')
gallery = JSON.parse(gallery)
//todo pull item´s stock property from alert
const stockForm = document.getElementById('stock-form')
//* Additional functions
//todo random integer
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//todo save default data
const saveGalleryData = () => {
    fetch('product.json')
        .then(res => res.json())
        .then(data => {
            const constData = [...data]
            let gallery = []
            constData.forEach(item => {
                const product = new Item(item.pk, item.fields.name, item.fields.price, item.fields.brand, item.fields.img, item.fields.description, item.fields.categories)
                gallery.push(product)
            })
            gallery = JSON.stringify(gallery)
            localStorage.setItem('gallery', gallery)
        });
}
//todo update current data
const updateCurrentData = (data) => {
    let saveData = [...data]
    saveData = JSON.stringify(saveData)
    localStorage.setItem('gallery', saveData)
}
//todo delete default data
const deleteGalleryData = () => {
    localStorage.removeItem('gallery')
}
//todo udd user
const addUser = (user) => {
    let userArray = localStorage.getItem('users')
    if(userArray){
        userArray = JSON.parse(userArray)
    }else{
        localStorage.setItem('users','[]')
        userArray = localStorage.getItem('users')
        userArray = JSON.parse(userArray)
    }
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
//* add item to user´s cart
const addItem = (item, targetElement) => {
    //todo spread new item
    const newItem = {...item}
    let itemPrice = newItem.price
    let user = returnUser()
    const userCart = [...user.cart]
    stockForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let stockValue = stockForm.stock.value
        stockValue = (stockValue) ? parseInt(stockValue) : 0
        //todo verify the item’s existence in the user’s cart checking the user´s cart & based on item´s name
        let someItem = userCart.some(item => item.name == newItem.name)
        //? item exist this at user cart
        if(someItem){
            for(item of userCart){
                if(item.name == newItem.name){
                    const divParent = targetElement.closest('div')
                    const stockContainer = divParent.children[2]
                    const stockGalleryContainer = divParent.children[3]
                    gallery.forEach(item => {
                        if(item.name == newItem.name){
                            item.stock -= stockValue
                            if(item.stock <= 0){
                                gallery = gallery.filter(galleryItem => galleryItem.pk != item.pk)
                                row.innerHTML = ''
                                gallery.forEach(galleryItem => {
                                    const findItem = userCart.find(cartItem => cartItem.name == galleryItem.name)
                                    row.innerHTML += (findItem) ? cardItem(galleryItem, findItem.stock) : cardItem(galleryItem)
                                })
                            }else{
                                stockGalleryContainer.textContent = `Stock gallery - ${item.stock}`
                            }
                        }
                    })
                    item.stock += stockValue
                    item.price = itemPrice*item.stock
                    stockContainer.textContent = `Stock cart - ${item.stock}`
                }
            }
            updateCurrentData(gallery)
            user.cart = userCart
            updateUser(user)
            updateCurrentData(gallery)
        }
        else if(stockValue){
            //todo Prepare user object to set local storage
            newItem.pk = crypto.randomUUID()
            newItem.stock = stockValue
            newItem.price = stockValue*itemPrice
            const divParent = targetElement.closest('div')
            const stockContainer = divParent.children[2]
            const stockGalleryContainer = divParent.children[3]
            gallery.forEach(item => {
                if(item.name == newItem.name){
                    item.stock -= stockValue
                    if(item.stock <= 0){
                        gallery = gallery.filter(galleryItem => galleryItem.pk != item.pk)
                        row.innerHTML = ''
                        gallery.forEach(galleryItem => {
                            const findItem = userCart.find(cartItem => cartItem.name == galleryItem.name)
                            row.innerHTML += (findItem) ? cardItem(galleryItem, findItem.stock) : cardItem(galleryItem)
                        })
                    }else{
                        stockGalleryContainer.textContent = `Stock gallery - ${item.stock}`
                    }
                }
            })
            updateCurrentData(gallery)
            stockContainer.textContent = `Stock cart - ${stockValue}`
            //todo Append for user cart
            userCart.push(newItem)
            user.cart = userCart
            //todo Update user
            updateUser(user)
        }
        stockForm.reset()
    })
}
//* catching click
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
            const itemCart = {...arraySearch.find(item => item.pk == pk)}
            let price = itemCart.price
            price = parseInt(price)
            let user = returnUser()
            let cart = [...user.cart]
            const coincidence = cart.some(currentItem => currentItem.name == itemCart.name)
            if(coincidence){
                cart.forEach(currentItem => {
                    if(currentItem.name == itemCart.name){
                        currentItem.stock += 1
                        currentItem.price += price
                        const button = e.target
                        const divParent = button.closest('div')
                        const stockContainer = divParent.children[2]
                        const stockGalleryContainer = divParent.children[3]
                        gallery.forEach(item => {
                            if(item.name == itemCart.name){
                                item.stock -= 1
                                if(item.stock == 0){
                                    gallery = gallery.filter(galleryItem => galleryItem.pk != item.pk)
                                    row.innerHTML = ''
                                    gallery.forEach(galleryItem => {
                                        const findItem = cart.find(cartItem => cartItem.name == galleryItem.name)
                                        row.innerHTML += (findItem) ? cardItem(galleryItem, findItem.stock) : cardItem(galleryItem)
                                    })
                                }else{
                                    stockGalleryContainer.textContent = `Stock gallery - ${item.stock}`
                                }
                            }
                        })
                        stockContainer.textContent = `Stock cart - ${currentItem.stock}`
                    }
                })
                updateCurrentData(gallery)
                user.cart = cart
                updateUser(user)
            }
            else{
                itemCart.pk = crypto.randomUUID()
                itemCart.stock = 1
                itemCart.price = parseInt(itemCart.price)
                const button = e.target
                const divParent = button.closest('div')
                const stockContainer = divParent.children[2]
                stockContainer.textContent = `Stock cart - ${itemCart.stock}`
                const stockGalleryContainer = divParent.children[3]
                gallery.forEach(item => {
                    if(item.name == itemCart.name){
                        item.stock -= 1
                        if(item.stock == 0){
                            gallery = gallery.filter(galleryItem => galleryItem.pk != item.pk)
                            row.innerHTML = ''
                            gallery.forEach(galleryItem => {
                                const findItem = cart.find(cartItem => cartItem.name == galleryItem.name)
                                row.innerHTML += (findItem) ? cardItem(galleryItem, findItem.stock) : cardItem(galleryItem)
                            })
                        }else{
                            stockGalleryContainer.textContent = `Stock gallery - ${item.stock}`
                        }
                    }
                })
                updateCurrentData(gallery)
                cart.push(itemCart)
                user.cart = cart
                updateUser(user)
            }
        }
    })
}
//* HMTL components
//todo card html
const cardItem = (item, stockCart=0) => {
    //! <p class="card-text min-h-50">Categories - ${item.categories.join(', ')}</p>
    //! <p class="card-text">${item.description.slice(0, 120)}...</p>
    return `<div class="col-sm-6 col-lg-4 col-xxl-3 mb-3">
                <div class="card">
                    <img src=${item.img} class="card-img-top py-3 px-5" alt="${item.slug}-image" height="180">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Price - $${Number(item.price).toLocaleString('en-US')}</p>
                        <p class="card-text">Stock cart - ${stockCart}</p>
                        <p class="card-text">Stock gallery - ${item.stock}</p>
                        <p class="card-text min-h-50">Brand - ${item.brand}</p>
                        <button class="btn btn-primary me-3" id="${item.pk}" data-bs-target="#exampleModal" data-bs-toggle="modal">Add to cart</button>
                        <button class="btn btn-primary ${item.pk}">Add one item</button>
                    </div>
                </div>
        </div>`
}
//todo accordion item html
//! <p class="text-bg-light p-3 w-75">Categories - ${(item.categories).join(', ')}</p>
const accordionItem = (item, state='') => {
    return `<div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed bg-secondary-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${item.pk}" aria-expanded="false" aria-controls="flush-collapse${item.pk}" id="accordion-button-${item.pk}">
                ${item.name}
            </button>
        </h2>
        <div id="flush-collapse${item.pk}" class="accordion-collapse collapse ${state}" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body bg-dark-subtle">
                <p class="text-bg-light p-3">${item.description}</p>
                <p class="text-bg-light p-3 w-75">Brand - ${item.brand}</p>
                <p class="text-bg-light p-3 w-50">Price - $${Number(item.price).toLocaleString('en-US')}</p>
                <p class="text-bg-light p-3 w-25">Stock - ${item.stock}</p>
                <button class="btn btn-danger ${item.pk}">Delete item(s)</button>
                <button class="btn btn-danger" id=${item.pk}>Remove item</button>
                <button class="btn btn-warning ${item.pk}" data-bs-target="#exampleModal" data-bs-toggle="modal">Remove item(s)</button>
                <button class="btn btn-success ${item.pk}">Buy item(s)</button>
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
                ${item.name}
            </button>
        </h2>
        <div id="flush-collapse${item.pk}" class="accordion-collapse collapse ${state}" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body bg-dark-subtle">
                <p class="text-bg-light p-3">${item.description}</p>
                <p class="text-bg-light p-3 w-75">Categories - ${(item.categories).join(', ')}</p>
                <p class="text-bg-light p-3 w-75">Brand - ${item.brand}</p>
                <p class="text-bg-light p-3 w-25">Stock - ${item.stock}</p>
            </div>
        </div>
    </div>`
}
//* wrtie an accordion main content
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

export {saveGalleryData, deleteGalleryData, cardItem, addItem, click, accordionContent, accordionItem, accordionSubItem, returnUser, updateUser, addUser, returnUserList, randomInt, updateCurrentData, gallery, stockForm}