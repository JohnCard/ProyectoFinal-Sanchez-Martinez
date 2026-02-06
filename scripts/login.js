import { returnUserList } from "./helpers.js"

//todo login form
const loginForm = document.querySelector('form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    const userArray = returnUserList()
    let userArraySpread = [...userArray]
    let user = userArraySpread.find(item => item.email == email && item.password == password)
    if(user){
        user = JSON.stringify(user)
        localStorage.setItem('user', user)
        Toastify({
            text: 'User found',
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'green',
        }).showToast();
    }else{
        Toastify({
            text: 'Not found user!',
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'red',
        }).showToast();
    }
    loginForm.reset()
})