import { returnUserList } from "./helpers.js"

const user = localStorage.getItem('user')
//? an activated account?
if(user){
    // if user´s located redirect to user profile
    window.location.href = '../pages/buy.html'
}
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
        window.location.href = '../pages/buy.html'
        
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