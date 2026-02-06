import { addUser } from "./helpers.js"
import { User } from "./models.js"

//todo Form html element
const form = document.querySelector('form')
//* Form parameters
//todo Form data request handling
form.addEventListener('submit', (e) => {
    e.preventDefault()
    //todo Pull main parameters from html form
    const name = form.elements['name'].value
    const lastName = form.elements['last_name'].value
    const username = form.elements["username"].value
    const password = form.elements["password"].value
    const email = form.elements["email"].value
    const adress = form.elements['adress'].value
    const adress2 = form.elements["adress2"].value
    const birthday = form.elements["birthday"].value
    let credit = form.elements["credit"].value
    credit = parseFloat(credit)
    const role = form.elements["role"].value
    const city = form.elements["city"].value
    const state = form.elements["state"].value
    const country = form.elements["country"].value
    //* Create new user instance based on payload data
    const user = new User(name, lastName, username, email, password, birthday, credit, role, adress, adress2, city, state, country)
    addUser(user)
    form.reset()
})