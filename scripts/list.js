import { saveGalleryData, deleteGalleryData, cardItem, addItem, click, gallery, returnUser } from "./helpers.js";

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
    }
})
//* Save data buttons
const galleryDataButton = document.getElementById('button-gallery')
galleryDataButton.addEventListener('click', saveGalleryData)
//! Delete data buttons
const deleteGalleryButton = document.getElementById('delete-gallery')
deleteGalleryButton.addEventListener('click', deleteGalleryData)
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