import { saveGalleryData, deleteGalleryData, saveDefaultUser, deleteDefaultUser, cardItem, addItem, click, gallery, returnUser } from "./helpers.js";

//* Save data buttons
const galleryDataButton = document.getElementById('button-gallery')
galleryDataButton.addEventListener('click', saveGalleryData)
const userButton = document.getElementById('button-user')
userButton.addEventListener('click', saveDefaultUser)
//! Delete data buttons
const deleteGalleryButton = document.getElementById('delete-gallery')
deleteGalleryButton.addEventListener('click', deleteGalleryData)
const deleteUser = document.getElementById('delete-user')
deleteUser.addEventListener('click', deleteDefaultUser)
//todo row div html element
const row = document.querySelector('.row')
//todo sava items for user´s cart
const user = returnUser()
const userCart = [...user.cart]
for(let item of gallery){
    const findItem = userCart.find(itemCart => itemCart.fields.name == item.fields.name)
    row.innerHTML += (findItem) ? cardItem(item, findItem.stock) : cardItem(item)
}

click(row, addItem, gallery)