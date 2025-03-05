document.addEventListener('DOMContentLoaded', () => {
    const saveShopData = (product) => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
            alert("Please login to save shop data");
            return;
        }

        fetch('http://localhost:5000/api/shop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, product }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log("Shop data saved:", data.shop);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    // Example usage: Save a product when a button is clicked
    document.querySelector('.save-product-button').addEventListener('click', () => {
        const product = {
            name: "Trendy White Top",
            price: 499,
        };
        saveShopData(product);
    });
});