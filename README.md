# 🛍️ E-Commerce Shopping Cart Simulator

A full-featured client-side e-commerce simulator built with **vanilla JavaScript**, **Bootstrap 5**, and **Sass**. Features user authentication, a dynamic product gallery with a custom carousel, a shopping cart with real-time stock management, and full session persistence using `localStorage` as the data layer.

### 🔗 [Live Demo](https://primer-entrega-javascript.vercel.app)

---

### Tech Stack

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)
![Toastify](https://img.shields.io/badge/Toastify-JS-green?style=flat-square)
![UUID](https://img.shields.io/badge/UUID-v13-blue?style=flat-square)

---

### Features

- 👤 **User Authentication** — Register, login, logout, and account deletion
- 🛍️ **Product Gallery** — Dynamic product listing with images, prices, and stock levels
- 🎠 **Custom Carousel** — Responsive image carousel with variable visible items based on screen size
- 🛒 **Shopping Cart** — Add items, view cart summary, confirm purchases
- 💰 **Balance System** — Users have a credit balance that decreases with purchases
- 📦 **Collection Tracking** — Purchased items are stored in a personal collection
- 📊 **User Dashboard** — View username, email, balance, cart total, and purchased items
- 💾 **localStorage Persistence** — All data survives page reloads and sessions
- 📉 **Stock Synchronization** — Product stock updates dynamically after purchases
- 🔔 **Toast Notifications** — User feedback via Toastify.js
- 🌐 **Multi-page Architecture** — Separate HTML pages for home, gallery, cart, login, and registration

---

### Project Structure

```
ProyectoFinal-Sanchez-Martinez/
├── index.html                  # Landing page
├── package.json                # Dependencies (Bootstrap, Toastify, UUID)
├── pages/
│   ├── buy.html                # Shopping cart & user dashboard
│   ├── list.html               # Product gallery with carousel
│   ├── login.html              # Login form
│   ├── register.html           # Registration form
│   ├── product.json            # Product data source
│   └── user.json               # Default user data
├── scripts/
│   ├── helpers.js              # Shared utilities (DOM builders, storage ops)
│   ├── models.js               # User and Item class definitions
│   ├── cart.js                 # Cart page logic & user dashboard
│   ├── list.js                 # Gallery rendering & carousel
│   ├── login.js                # Login form handling
│   └── register.js             # Registration form handling
├── sass/
│   └── sass.scss               # Custom Sass styles
├── style/
│   ├── style.css               # Main stylesheet
│   ├── sass.css                # Compiled Sass output
│   ├── sass.css.map            # Source map
│   └── list.css                # Gallery-specific styles
└── img/                        # Product and UI images
```

---

### Getting Started

#### Prerequisites
- A modern web browser
- Node.js (optional, for dependency management)

#### Installation

```bash
# Clone the repository
git clone https://github.com/JohnCard/ProyectoFinal-Sanchez-Martinez.git

# Navigate to the project
cd ProyectoFinal-Sanchez-Martinez

# Install dependencies (optional — Bootstrap & Toastify loaded via CDN)
npm install

# Open in browser
open index.html
# Or use a local server:
npx serve .
```

#### Quick Start Guide

1. Navigate to **Register** and create a new account
2. **Login** with your credentials
3. Browse the **Gallery** to see available products
4. **Add items** to your shopping cart
5. Go to **Cart** to review, adjust quantities, and confirm your purchase
6. Check your **Dashboard** for balance and collection updates

---

### Screenshots

| Landing Page | Product Gallery | Shopping Cart | User Dashboard |
|:-:|:-:|:-:|:-:|
| ![Home](https://res.cloudinary.com/de1slf4r1/image/upload/v1774649580/Captura_de_pantalla_2026-03-27_a_la_s_4.12.46_p.m._e9dzya.png) | ![Gallery](https://res.cloudinary.com/de1slf4r1/image/upload/v1774649515/Captura_de_pantalla_2026-03-27_a_la_s_4.06.45_p.m._p25nau.png) | ![Cart](https://res.cloudinary.com/de1slf4r1/image/upload/v1774649448/Captura_de_pantalla_2026-03-27_a_la_s_4.08.30_p.m._oy5byt.png) | ![Dashboard](https://res.cloudinary.com/de1slf4r1/image/upload/v1774649433/Captura_de_pantalla_2026-03-27_a_la_s_4.08.22_p.m._rmebcp.png) |

---

### Technical Concepts Demonstrated

- **OOP in JavaScript** — `User` and `Item` classes with constructors and computed properties
- **ES6 Modules** — Import/export across multiple script files
- **DOM Manipulation** — Dynamic element creation and event handling
- **Client-side State Management** — Full CRUD operations via `localStorage`
- **Responsive Carousel** — Custom-built with dynamic `visibleItems` based on viewport width
- **Form Validation** — Password confirmation, required fields
- **UUID Generation** — Unique user IDs via `crypto.randomUUID()`
