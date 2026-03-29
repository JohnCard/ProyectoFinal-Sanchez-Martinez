import { randomInt } from "./helpers.js"

class User{
    constructor(name, lastName, username, email, password, birthday, credit, role, address, address2, city, state, country){
        //? current user´s age (additional operation)
        const userAge = new Date().getFullYear() - new Date(birthday).getFullYear()
        //* User parameters
        this.id = crypto.randomUUID()
        this.active = false
        this.lastLogin = null
        this.createdAt = new Date().toISOString().slice(0,10)
        this.updatedAt = new Date().toISOString().slice(0,10)
        this.shoppingCart = []
        this.collectionItems = []
        this.name = name
        this.birthday = birthday
        this.age = userAge
        this.lastName = lastName
        this.username = username
        this.email = email
        this.password = password
        this.credit = credit
        this.role = role
        this.img = 'https://cdn-icons-png.flaticon.com/512/12538/12538444.png'
        this.address = address
        this.address2 = address2
        this.city = city
        this.state = state
        this.country = country
    }
}

class Item{
    constructor(pk, name, price, brand, img, description, categories){
        this.pk = pk
        this.name = name
        this.price = price
        this.brand = brand
        this.img = img
        this.description = description
        this.categories = categories
        this.stock = randomInt(1,10)
    }
}

export {User, Item}