
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.querySelector('.search-bar input');
        
        
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const query = searchInput.value.toLowerCase().trim();
                const sections = {
                    'home': 'home',
                    'new trends': 'seller',
                    'brands': 'loved',
                    'casual' : 'photo-boxes',
                    'party' : 'photo-boxes',
                    'curvy' : 'photo-boxes',
                    'work' : 'photo-boxes',
                    'new products' : 'new-products',
                    'make up': 'explore',
                    'store locator': 'services',
                    'support': 'support',
                    'free shipping': 'services'
                };
                
                const sectionId = sections[query];
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    alert('Section not found!');
                }
            }
        });
    });


     function googleTranslateElementInit() {
         new google.translate.TranslateElement({
             pageLanguage: 'en',
             includedLanguages: 'en,es,fr',
             layout: google.translate.TranslateElement.InlineLayout.SIMPLE
         }, 'google_translate_element');
     }

     function showTranslate() {
         var translateElement = document.getElementById('google_translate_element');
         if (translateElement.style.display === 'none') {
             translateElement.style.display = 'block';
             googleTranslateElementInit();
         } else {
             translateElement.style.display = 'none';
         }
     };


     const countDownDate = new Date().getTime() + (1 * 60 * 60 * 1000); 

    
     let countdownInterval = setInterval(function() {
         
         const now = new Date().getTime();
         const timeLeft = countDownDate - now;
        
        
         const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
         
         
         document.getElementById("hours").innerHTML = ("0" + hours).slice(-2);
         document.getElementById("minutes").innerHTML = ("0" + minutes).slice(-2);
         document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);
         
         
         if (timeLeft < 0) {
             clearInterval(countdownInterval);
             document.getElementById("hours").innerHTML = "00";
             document.getElementById("minutes").innerHTML = "00";
             document.getElementById("seconds").innerHTML = "00";
         }
     }, 1000);





document.addEventListener("DOMContentLoaded", () => {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (userEmail && userName) {
        // Hide login button and show user info
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("userName").textContent = userName;
    } else {
       
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("userInfo").style.display = "none";
    }

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Logout successful") {
                
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                window.location.href = "login.html";
            }
        })
        .catch(error => console.error('Error:', error));
    });

   
    document.getElementById("loginBtn").addEventListener("click", () => {
        window.location.href = "login.html";
    });
});

console.log("User Email:", userEmail);
console.log("User Name:", userName);