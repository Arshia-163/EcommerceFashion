// document.addEventListener('DOMContentLoaded', () => {
//     const categoryFilters = document.querySelectorAll('.category-filter');
//     const colorFilters = document.querySelectorAll('.color-filter');
//     const sizeFilters = document.querySelectorAll('.size-filter');
//     const productGrid = document.getElementById('productGrid');
//     const activeFiltersContainer = document.getElementById('activeFilters');
//     const clearFiltersButton = document.getElementById('clearFilters');

//     let activeFilters = {
//         category: new Set(),
//         color: new Set(),
//         size: new Set(),
//     };

   
//     [...categoryFilters, ...colorFilters, ...sizeFilters].forEach((filter) => {
//         filter.addEventListener('change', () => {
//             updateActiveFilters(filter);
//             applyFilters();
//             displayActiveFilters();
//         });
//     });

    
//     function updateActiveFilters(filter) {
//         const filterType = filter.classList.contains('category-filter') ? 'category' :
//             filter.classList.contains('color-filter') ? 'color' : 'size';

//         if (filter.checked) {
//             activeFilters[filterType].add(filter.value);
//         } else {
//             activeFilters[filterType].delete(filter.value);
//         }
//     }

    
//     function applyFilters() {
//         const products = productGrid.querySelectorAll('.product-card');
//         products.forEach(product => {
//             const category = product.getAttribute('data-category');
//             const color = product.getAttribute('data-color');
//             const size = product.getAttribute('data-size');

//             const matchesCategory = activeFilters.category.size === 0 || activeFilters.category.has(category);
//             const matchesColor = activeFilters.color.size === 0 || activeFilters.color.has(color);
//             const matchesSize = activeFilters.size.size === 0 || activeFilters.size.has(size);

//             if (matchesCategory && matchesColor && matchesSize) {
//                 product.style.display = 'block';
//             } else {
//                 product.style.display = 'none';
//             }
//         });
//     }


//     function displayActiveFilters() {
//         activeFiltersContainer.innerHTML = ''; 

//         Object.keys(activeFilters).forEach(filterType => {
//             activeFilters[filterType].forEach(value => {
//                 const filterTag = document.createElement('div');
//                 filterTag.classList.add('filter-tag');
//                 filterTag.textContent = value;

            
//                 const removeButton = document.createElement('button');
//                 removeButton.textContent = 'x';
//                 removeButton.classList.add('remove-filter');
//                 removeButton.addEventListener('click', () => {
//                     removeFilter(filterType, value);
//                 });

//                 filterTag.appendChild(removeButton);
//                 activeFiltersContainer.appendChild(filterTag);
//             });
//         });

    
//         clearFiltersButton.style.display = (activeFilters.category.size || activeFilters.color.size || activeFilters.size.size) ? 'block' : 'none';
//     }

    
//     function removeFilter(filterType, value) {
//         activeFilters[filterType].delete(value);
//         document.querySelector(`input.${filterType}-filter[value="${value}"]`).checked = false;
//         applyFilters();
//         displayActiveFilters();
//     }


//     clearFiltersButton.addEventListener('click', () => {
//         clearAllFilters();
//         applyFilters();
//         displayActiveFilters();
//     });

    
//     function clearAllFilters() {
//         activeFilters = {
//             category: new Set(),
//             color: new Set(),
//             size: new Set(),
//         };
//         [...categoryFilters, ...colorFilters, ...sizeFilters].forEach(filter => filter.checked = false);
//     }

    
//     applyFilters();
//     displayActiveFilters();
// });
document.addEventListener("DOMContentLoaded", () => {
    const filters = {
        category: new Set(),
        color: new Set(),
        size: new Set()
    };

    const productGrid = document.getElementById("productGrid");
    const checkboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox']");
    const activeFilters = document.getElementById("activeFilters");
    const clearFiltersButton = document.getElementById("clearFilters");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const type = checkbox.classList.contains("category-filter") ? "category" : 
                         checkbox.classList.contains("color-filter") ? "color" : "size";
            
            if (checkbox.checked) {
                filters[type].add(checkbox.value);
            } else {
                filters[type].delete(checkbox.value);
            }
            updateFilters();
            filterProducts();
        });
    });

    function updateFilters() {
        activeFilters.innerHTML = "";
        Object.keys(filters).forEach(key => {
            filters[key].forEach(value => {
                const filterTag = document.createElement("span");
                filterTag.textContent = value;
                filterTag.classList.add("filter-tag");
                activeFilters.appendChild(filterTag);
            });
        });
    }

    function filterProducts() {
        const products = document.querySelectorAll(".product-card");
        products.forEach(product => {
            const category = product.dataset.category;
            const color = product.dataset.color;
            const size = product.dataset.size;
            
            const categoryMatch = filters.category.size === 0 || filters.category.has(category);
            const colorMatch = filters.color.size === 0 || filters.color.has(color);
            const sizeMatch = filters.size.size === 0 || filters.size.has(size);
            
            if (categoryMatch && colorMatch && sizeMatch) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    clearFiltersButton.addEventListener("click", () => {
        filters.category.clear();
        filters.color.clear();
        filters.size.clear();
        checkboxes.forEach(checkbox => checkbox.checked = false);
        updateFilters();
        filterProducts();
    });

    filterProducts();
});
