import { saveGalleryData, cardItem, gallery, returnUser, updateUser, updateCurrentData } from "./helpers.js"

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
    }
})
//todo pull item´s stock property from alert
const stockForm = document.getElementById('stock-form')
//todo modal
const modalElement = document.getElementById('exampleModal')
//* Save data button
const galleryDataButton = document.getElementById('button-gallery')
galleryDataButton.addEventListener('click', saveGalleryData)
//todo row div html element
const row = document.querySelector('.row')
//todo sava items for user´s cart
const user = returnUser()
for(let item of gallery){
    const findItem = user.cart.find(itemCart => itemCart.name == item.name)
    row.innerHTML += (findItem) ? cardItem(item, findItem.stock) : cardItem(item)
}


//* carousel
const track = document.querySelector(".carousel-track");
const viewport = document.querySelector(".carousel-viewport");

let currentIndex = 0;
let visibleItems = 4; // provisional
let imageWidth = 0;

function renderImages(images, container) {
    images.forEach(item => {
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.name;
        container.appendChild(img);
    });
}

renderImages(gallery, track)

function updateVisibleItems() {
    const width = window.innerWidth; 

    if (width >= 1200) visibleItems = 5;
    else if (width >= 768) visibleItems = 4;
    else visibleItems = 2;
}

function updateImageWidth() {
    const viewportWidth = viewport.offsetWidth;
    imageWidth = viewportWidth / visibleItems;

    const imgs = document.querySelectorAll(".carousel-track img");
    imgs.forEach(img => {
        img.style.width = `${imageWidth}px`;
        img.style.height = `${250}px`
        img.classList.add('px-30px')
    });
}

function moveCarousel() {
    const offset = currentIndex * imageWidth;
    track.style.transform = `translateX(-${offset}px)`;
}

updateVisibleItems();
updateImageWidth();

//* carousel window event
window.addEventListener("resize", () => {
    updateVisibleItems();
    updateImageWidth();
    moveCarousel();
});

document.querySelector(".right").addEventListener("click", () => {
    if (currentIndex < gallery.length - visibleItems) {
        currentIndex++;
    }
    moveCarousel();
});

document.querySelector(".left").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
    }
    moveCarousel();
});

//! carousel ends
//* main gallery logic & container
row.addEventListener('click', (e) => {
    let user = returnUser()
    const tagContent = e.target.textContent
    const pk = e.target.classList[2]
    const divParent = e.target.closest('div')
    const stockContainer = divParent.children[2]
    const stockGalleryContainer = divParent.children[3]
    const itemGallery = gallery.find(item => item.pk == pk)
    let itemPrice = parseInt(itemGallery.price)
    const shoopingCartCoincidence = user.cart.find(item => item.name == itemGallery.name)
    if(tagContent == 'Add to cart'){
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault()
            let stockValue = stockForm.stock.value
            stockValue = (stockValue) ? parseInt(stockValue) : 0
            stockValue = (stockValue < parseInt(itemGallery.stock)) ? stockValue : parseInt(itemGallery.stock)
            //? item exist this at user cart
            if(shoopingCartCoincidence){
                shoopingCartCoincidence.stock += stockValue
                shoopingCartCoincidence.price += stockValue*itemPrice
                stockContainer.textContent = `Stock cart - ${shoopingCartCoincidence.stock}`
            }
            else if(stockValue){
                //todo prepare user object to set local storage
                const newItem = {...itemGallery}
                newItem.pk = crypto.randomUUID()
                newItem.stock = stockValue
                newItem.price = stockValue*itemPrice
                user.cart.push(newItem)
                stockContainer.textContent = `Stock cart - ${stockValue}`
            }
            itemGallery.stock -= stockValue
            if(itemGallery.stock <= 0){
                const index = gallery.indexOf(itemGallery)
                gallery.splice(index, 1)
                row.innerHTML = ''
                gallery.forEach(galleryItem => {
                    const cartItem = user.cart.find(item => item.name == galleryItem.name)
                    row.innerHTML += (cartItem) ? cardItem(galleryItem, cartItem.stock) : cardItem(galleryItem)
                })
            }else{
                stockGalleryContainer.textContent = `Stock gallery - ${itemGallery.stock}`
            }
            updateUser(user)
            updateCurrentData(gallery)
            const modal = bootstrap.Modal.getInstance(modalElement)
            modal.hide()
            stockForm.reset()
        })
    }else{
        if(shoopingCartCoincidence){
            shoopingCartCoincidence.stock += 1
            shoopingCartCoincidence.price += itemPrice
            stockContainer.textContent = `Stock cart - ${shoopingCartCoincidence.stock}`
        }
        else{
            const newItem = {...itemGallery}
            newItem.pk = crypto.randomUUID()
            newItem.stock = 1
            newItem.price = itemPrice
            user.cart.push(newItem)
            stockContainer.textContent = `Stock cart - ${1}`
        }
        itemGallery.stock -= 1
        if(itemGallery.stock == 0){
            const index = gallery.indexOf(itemGallery)
            gallery.splice(index, 1)
            row.innerHTML = ''
            gallery.forEach(galleryItem => {
                const cartItem = user.cart.find(item => item.name == galleryItem.name)
                row.innerHTML += (cartItem) ? cardItem(galleryItem, cartItem.stock) : cardItem(galleryItem)
            })
        }else{
            stockGalleryContainer.textContent = `Stock gallery - ${itemGallery.stock}`
        }
        updateUser(user)
        updateCurrentData(gallery)
    }
})