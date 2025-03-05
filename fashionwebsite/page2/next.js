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
