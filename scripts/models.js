class User{
    constructor(name, lastname, username, email, password, birthday, credit, role, adress, adress2, city, state, country){
        //? current user´s age (additinoal operation)
        const userAge = new Date().getFullYear() - new Date(birthday).getFullYear()
        //* User parameters
        this.id = crypto.randomUUID()
        this.active = false
        this.lastLogin = null
        this.createdAt = new Date().toISOString().slice(0,10)
        this.updatedAt = new Date().toISOString().slice(0,10)
        this.cart = []
        this.collected_items = []
        this.name = name
        this.birthday = birthday
        this.age = userAge
        this.lastname = lastname
        this.username = username
        this.email = email
        this.password = password
        this.credit = credit
        this.role = role
        this.img = 'https://cdn-icons-png.flaticon.com/512/12538/12538444.png'
        this.adress = adress
        this.adress2 = adress2
        this.city = city
        this.state = state
        this.country = country
    }
}

class Item{
    constructor(name, price, brand, img, description, categories){
        this.name = name
        this.price = price
        this.brand = brand
        this.img = img
        this.description = description
        this.categories = categories
    }
}

const result = new Date(2024, 6, 15) - new Date(2024, 6, 14)

export {User}