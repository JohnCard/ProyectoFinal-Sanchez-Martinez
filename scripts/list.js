import { saveGalleryData, cardItem, gallery, returnUser, updateUser, updateCurrentData } from "./helpers.js"

// modal example element
const modalElement = document.getElementById('exampleModal')
// save data button and it´s event listener function
const galleryDataButton = document.getElementById('button-gallery')
galleryDataButton.addEventListener('click', saveGalleryData)
// .row div element (gallery´s container)
const row = document.querySelector('.row')
// user variable for user´s shooping cart and collection items handling
const user = returnUser()


// get the track and viewport div containers
const track = document.querySelector(".carousel-track");
const viewport = document.querySelector(".carousel-viewport");

// initialize next variables
let currentIndex = 0;
let visibleItems = 4; // provisional
let imageWidth = 0;

// function to render images to a specified container, this function will iterate through each item from images array to use the img and name keys of the current instance and assign them for recently img created
function renderImages(images, container) {
    images.forEach(item => {
        // create img element
        const img = document.createElement("img");
        // assign its src value from item´s img
        img.src = item.img;
        // assign its alt value from item´s name
        img.alt = item.name;
        container.appendChild(img);
    });
}

renderImages(gallery, track)

function updateVisibleItems() {
    // get the current window's width
    const width = window.innerWidth; 

    // set the number of visible items based on screen width
    if (width >= 1200) visibleItems = 5;      // Large screens
    else if (width >= 768) visibleItems = 4;  // Medium screens
    else visibleItems = 2;                    // Small screens
}


function updateImageWidth() {
    // get the viewport´s current offsetWidth value
    const viewportWidth = viewport.offsetWidth;
    // you will get the result of dividing the total viewport width by the number of visible items
    imageWidth = viewportWidth / visibleItems;

    // select all images inside the carousel track
    const imgs = document.querySelectorAll(".carousel-track img");

    // set each image's width and height, and add a padding class
    imgs.forEach(img => {
        img.style.width = `${imageWidth}px`;  // set width based on calculated imageWidth
        img.style.height = `250px`;           // set fixed height
        img.classList.add('px-30px');         // add padding class
    });
}

function moveCarousel() {
    // calculate the horizontal offset based on the current index and image width
    const offset = currentIndex * imageWidth;
    // move the carousel track to show the current image
    track.style.transform = `translateX(-${offset}px)`;
}

updateVisibleItems();
updateImageWidth();

// carousel window event
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

setInterval(() => {
    currentIndex++;
    moveCarousel();
}, 5000)


// iterate each item of gallery list
for(let item of gallery){
    // try to find a coinciedence in shooping cart with a item whose name matches with current gallery´s item
    const findItem = (user) ? user.shoopingCart.find(itemCart => itemCart.name == item.name) : undefined
    // add cart item string templateto div.row container
    row.innerHTML += (findItem) ? cardItem(item, user.role, findItem.stock) : cardItem(item, user.role)
}


// gallery container´s logic handling
row.addEventListener('click', (e) => {
    // call user variable once gain
    let user = returnUser()
    // get the text content of the element that triggered the click event
    const tagContent = e.target.textContent
    // get the third class name of the clicked element (index 2)
    const pk = e.target.classList[2]
    // find the closest parent <div> element of the clicked element
    const divParent = e.target.closest('div')
    // get the third child element of the parent div (index 2)
    const stockContainer = divParent.children[2]
    // get the fourth child element of the parent div (index 3)
    const stockGalleryContainer = divParent.children[3]
    // filter gallery´s item instance by it´s primary key
    const itemGallery = gallery.find(item => item.pk == pk)
    // pull item´s price value
    let itemPrice = parseInt(itemGallery.price)
    // find a shooing cart item whose name matches the current gallery item's name
    const shoopingCartCoincidence = user.shoopingCart.find(item => item.name == itemGallery.name)
    if(tagContent == 'Add one item'){
        //? any match? then we just need to modify the item in the user´s shopping cart
        if(shoopingCartCoincidence){
            // add one to the item’s stock value
            shoopingCartCoincidence.stock += 1
            // update the unit price to indicate that we’ve added the same item again
            shoopingCartCoincidence.price += itemPrice
            // update stock html container value
            stockContainer.textContent = `Stock shooping cart - ${shoopingCartCoincidence.stock}`
        }//? no match?, edit new item from scratch to add to shooping cart as new product
        else{
            // extract copy from current gallery´s item to avoid modify the itemGallery instance
            const newItem = {...itemGallery}
            // set primary key
            newItem.pk = crypto.randomUUID()
            // initialize its stock value to 1.
            newItem.stock = 1
            // assing its price value to unit price or original value
            newItem.price = itemPrice
            // add it to shooping cart
            user.shoopingCart.push(newItem)
            // update stock container value for item´s state in shooping cart
            stockContainer.textContent = `Stock shooping cart - ${newItem.stock}`
        }
        // subtract one from the original item's stock value
        itemGallery.stock -= 1
        //? is its value equal to 0?
        if(itemGallery.stock == 0){
            // check its index in the gallery array
            const index = gallery.indexOf(itemGallery)
            // delete from gallery array based on its index position
            gallery.splice(index, 1)
            // empty row container value
            row.innerHTML = ''
            // iterate through each gallery´s item
            gallery.forEach(galleryItem => {
                // look for a match in the shooping cart for current gallery´s item
                const shoopingCartItem = user.shoopingCart.find(item => item.name == galleryItem.name)
                // add an additional string template to the row HTML container.
                // if a match is found in the shopping cart for the current item, we pass the item's stock value as a parameter.
                // if no match exists, we just pass the current galleryItem as a parameter to the cardItem function to add the HTML string template.
                row.innerHTML += (shoopingCartItem) ? cardItem(galleryItem, user.role, shoopingCartItem.stock) : cardItem(galleryItem)
            })
        }//? current item is still existent at gallery?
        else{
            // update stock gallery element value
            stockGalleryContainer.textContent = `Stock gallery - ${itemGallery.stock}`
        }
        // update user and gallery at local storage
        updateUser(user)
        updateCurrentData(gallery)
    }else if(tagContent == 'Add item'){
        itemGallery.stock += 1
        stockGalleryContainer.textContent = `Stock gallery - ${itemGallery.stock}`
        updateCurrentData(gallery)
    }else if(tagContent == 'Remove item'){
        itemGallery.stock -= 1
        //? is its value equal to 0?
        if(itemGallery.stock == 0){
            // check its index in the gallery array
            const index = gallery.indexOf(itemGallery)
            // delete from gallery array based on its index position
            gallery.splice(index, 1)
            // empty row container value
            row.innerHTML = ''
            // iterate through each gallery´s item
            gallery.forEach(galleryItem => {
                // look for a match in the shooping cart for current gallery´s item
                const shoopingCartItem = user.shoopingCart.find(item => item.name == galleryItem.name)
                // add an additional string template to the row HTML container.
                // if a match is found in the shopping cart for the current item, we pass the item's stock value as a parameter.
                // if no match exists, we just pass the current galleryItem as a parameter to the cardItem function to add the HTML string template.
                row.innerHTML += (shoopingCartItem) ? cardItem(galleryItem, user.role, shoopingCartItem.stock) : cardItem(galleryItem)
            })
        }//? current item is still existent at gallery?
        else{
            // update stock gallery element value
            stockGalleryContainer.textContent = `Stock gallery - ${itemGallery.stock}`
        }
        updateCurrentData(gallery)
    }
})