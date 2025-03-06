
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById("mainImage");

// Change the main image when a thumbnail is clicked
function changeImage(thumbnail) {
    mainImage.src = thumbnail.src;
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function () {
        changeImage(thumbnail);
    });
});

// Zoom effect on main image
mainImage.addEventListener('click', function () {
    this.style.transform = this.style.transform === "scale(1.5)" ? "scale(1)" : "scale(1.5)";
});

// ---- WISHLIST BUTTON FUNCTIONALITY ----
const wishlistButtons = document.querySelectorAll('.wishlist');
wishlistButtons.forEach(button => {
    button.addEventListener('click', function () {
        this.classList.toggle('active');
    });
});

// ---- CART FUNCTIONALITY ----
const API_URL = 'http://localhost:5000/api/cart'; // Ensure correct API URL

async function loadCart() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load cart');
        const cart = await response.json();

        const cartContainer = document.getElementById('cartItems');
        cartContainer.innerHTML = ""; // Clear previous cart display
        let total = 0;
        let totalQuantity = 0; // Track total items in cart

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalQuantity += item.quantity; // Add quantity to cart count

            // Create cart item dynamically
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <span>${item.name}</span>
                <div class="quantity-buttons">
                    <button class="decrease-btn" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-name="${item.name}">+</button>
                </div>
                <button class="remove-btn" data-name="${item.name}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        document.getElementById("cartTotal").innerText = `₹${total}`;
        updateCartIcon(totalQuantity); // Update cart icon count
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}


function updateCartIcon(count) {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}


async function addToCart(name, price) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, quantity: 1 })
        });
        await loadCart(); 
        alert(`${name} has been added to the cart!`);
    } catch (error) {
        console.error('Error adding item:', error);
    }
}


document.querySelectorAll(".addToBagBtn").forEach(button => {
    button.addEventListener("click", function () {
        const itemName = this.getAttribute("data-name");
        const itemPrice = parseInt(this.getAttribute("data-price"));
        addToCart(itemName, itemPrice);
    });
});


async function updateQuantity(name, quantity) {
    if (quantity < 1) return removeFromCart(name);
    try {
        await fetch(`${API_URL}/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        await loadCart();
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}


async function removeFromCart(name) {
    try {
        await fetch(`${API_URL}/${encodeURIComponent(name)}`, { method: 'DELETE' });
        await loadCart(); 
    } catch (error) {
        console.error('Error removing item:', error);
    }
}


document.getElementById('cartItems').addEventListener('click', function (event) {
    if (event.target.classList.contains('increase-btn')) {
        const itemName = event.target.getAttribute("data-name");
        updateQuantity(itemName, 1);
    } else if (event.target.classList.contains('decrease-btn')) {
        const itemName = event.target.getAttribute("data-name");
        updateQuantity(itemName, -1);
    } else if (event.target.classList.contains('remove-btn')) {
        const itemName = event.target.getAttribute("data-name");
        removeFromCart(itemName);
    }
});


function toggleCartSidebar() {
    const sidebar = document.getElementById("cartSidebar");
    sidebar.style.right = sidebar.style.right === "0px" ? "-300px" : "0px";
}

// Close the cart sidebar
function closeCartSidebar() {
    document.getElementById("cartSidebar").style.right = "-300px";
}


document.addEventListener('DOMContentLoaded', loadCart);
