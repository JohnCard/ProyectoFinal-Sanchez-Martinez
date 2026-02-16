import { addUser } from "./helpers.js"
import { User } from "./models.js"

// user existence confirmation
const userExistence = localStorage.getItem('user')
//? some user existence confirmed?
if(userExistence){
    // if user´s located redirect to user profile
    window.location.href = '../pages/buy.html'
}
//todo extract html form from document
const form = document.querySelector('form')
//todo form data request handling
form.addEventListener('submit', (e) => {
    e.preventDefault()
    //todo pull main parameters from html form
    const name = form.name.value
    const lastName = form.lastName.value
    const username = form.username.value
    const password = form.password.value
    const passwordConfirmation = form.passwordConfirm.value
    const email = form.email.value
    const adress = form.adress.value
    const adress2 = form.adress2.value
    const birthday = form.birthday.value
    let credit = form.credit.value
    credit = parseFloat(credit)
    const role = form.role.value
    const city = form.city.value
    const state = form.state.value
    const country = form.country.value
    //* create new user instance based on payload data
    const user = new User(name, lastName, username, email, password, birthday, credit, role, adress, adress2, city, state, country)
    //? is the password field equal to password confirmation
    if(password == passwordConfirmation){
        addUser(user)
    }//? initial password and its confirmation dosen´t match?
    else{
        Swal.fire({
            title: 'Password field error!',
            text: 'Original password and its confirmation dosen´t match',
            icon: 'error',
            confirmButtonText: 'Ok',
        })
    }
    form.reset()
})