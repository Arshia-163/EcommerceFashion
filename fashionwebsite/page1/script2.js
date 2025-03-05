const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById("mainImage");

// Change the main image based on the clicked thumbnail
function changeImage(thumbnail) {
    const newSrc = thumbnail.src;
    mainImage.src = newSrc.replace("200x300", "400x600");
}

// Add event listeners to thumbnails for click events
thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', function () {
        changeImage(thumbnail);
    });
});


mainImage.addEventListener('click', function () {
    if (mainImage.style.transform === "scale(1.5)") {
        mainImage.style.transform = "scale(1)";
    } else {
        mainImage.style.transform = "scale(1.5)";
    }
});
const wishlistButton = document.querySelector('.wishlist');


// Toggle the active state when the button is clicked
wishlistButton.addEventListener('click', function() {
    this.classList.toggle('active');
});


// Cart functionality in script2.js

let cart = []; // To store cart items
let cartCount = 0; // To store the number of items in the cart

// Update cart count in the UI
function updateCartCount() {
    document.getElementById("cart-count").innerText = cartCount;
}

// Add item to cart
document.getElementById("addToBagBtn").addEventListener("click", function() {
    const item = {
        name: "Women Plain A-Line Casual Top",
        price: 499,
        quantity: 1
    };

    // Check if item is already in cart
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push(item);
    }

    cartCount += 1; // Update cart count
    updateCartCount(); // Update UI cart count
    alert("Your item has been added to the cart!");
    updateCartSidebar(); // Update cart sidebar
});

// Update cart sidebar
function updateCartSidebar() {
    const cartItemsContainer = document.getElementById("cartItems");
    cartItemsContainer.innerHTML = ""; // Clear previous items

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        // Create cart item
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <span>${item.name}</span>
            <div class="quantity-buttons">
                <button onclick="increaseQuantity('${item.name}')">+</button>
                <span>${item.quantity}</span>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Update total
    document.getElementById("cartTotal").innerText = total;
}

// Increase quantity of item
function increaseQuantity(itemName) {
    const item = cart.find(cartItem => cartItem.name === itemName);
    if (item) {
        item.quantity += 1; // Increase quantity
        cartCount += 1; // Increase cart count
        updateCartCount(); // Update UI cart count
        updateCartSidebar(); // Update cart sidebar
    }
}

// Decrease quantity of item
function decreaseQuantity(itemName) {
    const item = cart.find(cartItem => cartItem.name === itemName);
    if (item && item.quantity > 1) {
        item.quantity -= 1; // Decrease quantity
        cartCount -= 1; // Decrease cart count
        updateCartCount(); // Update UI cart count
        updateCartSidebar(); // Update cart sidebar
    }
}

// Show or hide the cart sidebar
function toggleCartSidebar() {
    const sidebar = document.getElementById("cartSidebar");
    const sidebarRight = sidebar.style.right === "0px" ? "-300px" : "0px";
    sidebar.style.right = sidebarRight;
}

// Close the cart sidebar
function closeCartSidebar() {
    document.getElementById("cartSidebar").style.right = "-300px";
}
