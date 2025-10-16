// Sample food items data for each category with high-quality images
const foodData = {
    desserts: [
        { 
            id: 1, 
            name: 'Chocolate Brownie', 
            price: 80, 
            image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&q=80', 
            description: 'Rich chocolate brownie with ice cream' 
        },
       
        { 
            id: 3, 
            name: 'Ice Cream Sundae', 
            price: 100, 
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80', 
            description: 'Vanilla ice cream with toppings' 
        },
      
        { 
            id: 5, 
            name: 'Chocolate Cake', 
            price: 120, 
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', 
            description: 'Layered chocolate cake slice' 
        },
        
       
    ],
    
    beverages: [
        { 
            id: 7, 
            name: 'Cold Coffee', 
            price: 60, 
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80', 
            description: 'Chilled coffee with ice cream' 
        },
       
      
        { 
            id: 11, 
            name: 'Green Tea', 
            price: 30, 
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80', 
            description: 'Healthy green tea' 
        },
        { 
            id: 12, 
            name: 'Cappuccino', 
            price: 80, 
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80', 
            description: 'Classic Italian coffee' 
        }
    ],
    
    bakers: [
        { 
            id: 13, 
            name: 'Croissant', 
            price: 60, 
            image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=500&q=80', 
            description: 'Buttery French pastry' 
        },
        { 
            id: 14, 
            name: 'Chocolate Muffin', 
            price: 50, 
            image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80', 
            description: 'Moist chocolate muffin' 
        },
        
        { 
            id: 16, 
            name: 'Sandwich', 
            price: 90, 
            image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&q=80', 
            description: 'Veg grilled sandwich' 
        },
        { 
            id: 17, 
            name: 'Puff Pastry', 
            price: 40, 
            image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&q=80', 
            description: 'Crispy vegetable puff' 
        },
        { 
            id: 18, 
            name: 'Pizza Slice', 
            price: 100, 
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80', 
            description: 'Cheesy pizza slice' 
        }
    ],
    
    chinese: [
        { 
            id: 19, 
            name: 'Veg Fried Rice', 
            price: 120, 
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80', 
            description: 'Stir-fried rice with vegetables' 
        },
        { 
            id: 20, 
            name: 'Hakka Noodles', 
            price: 130, 
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80', 
            description: 'Indo-Chinese noodles' 
        },
       
       
        
        { 
            id: 24, 
            name: 'Veg Momos', 
            price: 80, 
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80', 
            description: 'Steamed vegetable dumplings' 
        }
    ],
    
    juices: [
       
        { 
            id: 26, 
            name: 'Orange Juice', 
            price: 60, 
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', 
            description: 'Freshly squeezed orange juice' 
        },
   
        
       
        { 
            id: 30, 
            name: 'Mango Juice', 
            price: 50, 
            image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&q=80', 
            description: 'Healthy carrot juice' 
        }
    ],
    
    Popular: [
        { 
            id: 31, 
            name: 'Pasta Alfredo', 
            price: 180, 
            image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80', 
            description: 'Creamy white sauce pasta' 
        },
        { 
            id: 32, 
            name: 'Veg Burger', 
            price: 120, 
            image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80', 
            description: 'Loaded vegetable burger' 
        },
        { 
            id: 33, 
            name: 'French Fries', 
            price: 80, 
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80', 
            description: 'Crispy golden fries' 
        },
        { 
            id: 34, 
            name: 'Grilled Sandwich', 
            price: 100, 
            image: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=500&q=80', 
            description: 'Grilled cheese sandwich' 
        },
        { 
            id: 35, 
            name: 'Nachos', 
            price: 140, 
            image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500&q=80', 
            description: 'Corn chips with cheese dip' 
        },
        { 
            id: 36, 
            name: 'Mac and Cheese', 
            price: 160, 
            image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&q=80', 
            description: 'Macaroni in cheese sauce' 
        }
    ],
    
    'north-indian': [
        { 
            id: 37, 
            name: 'Paneer Butter Masala', 
            price: 180, 
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80', 
            description: 'Paneer in rich tomato gravy' 
        },
       
        { 
            id: 39, 
            name: 'Dal Makhani', 
            price: 140, 
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80', 
            description: 'Creamy black lentil curry' 
        },
        
      
       
    ],
    
    'south-indian': [
        { 
            id: 43, 
            name: 'Masala Dosa', 
            price: 80, 
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80', 
            description: 'Crispy dosa with potato filling' 
        },
        { 
            id: 44, 
            name: 'Idli Sambar', 
            price: 50, 
            image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80', 
            description: 'Steamed rice cakes with lentil soup' 
        },
      
      
        { 
            id: 47, 
            name: 'Veg Biryani', 
            price: 200, 
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80', 
            description: 'Aromatic rice with vegetables' 
        },
      
    ],
    
    japanese: [
        { 
            id: 49, 
            name: 'Veg Sushi Roll', 
            price: 220, 
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80', 
            description: 'Fresh vegetable sushi' 
        },
    
        { 
            id: 51, 
            name: 'Tempura', 
            price: 180, 
            image: 'https://images.unsplash.com/photo-1588347818036-b6e2c6273f19?w=500&q=80', 
            description: 'Battered fried vegetables' 
        },
        { 
            id: 52, 
            name: 'Ramen Noodles', 
            price: 200, 
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', 
            description: 'Japanese noodle soup' 
        },
     
       
    ],
    
    other: [
        { 
            id: 55, 
            name: 'Tacos', 
            price: 150, 
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80', 
            description: 'Mexican street food' 
        },
        { 
            id: 56, 
            name: 'Falafel Wrap', 
            price: 130, 
            image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&q=80', 
            description: 'Middle Eastern wrap' 
        },
     
     
        { 
            id: 59, 
            name: 'Thai Curry', 
            price: 180, 
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80', 
            description: 'Coconut-based curry' 
        },
     
    ]
};

// Cart array to store items
let cart = [];

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    loadCategoryItems();
    updateCartDisplay();
});

// Load category items based on URL parameter
function loadCategoryItems() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category && foodData[category]) {
        displayCategoryItems(category, foodData[category]);
    } else {
        // Default to desserts if no category specified
        displayCategoryItems('desserts', foodData.desserts);
    }
}

// Display food items for selected category
function displayCategoryItems(category, items) {
    const container = document.getElementById('foodItemsContainer');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    // Update category header
    const categoryNames = {
        'desserts': 'Desserts',
        'beverages': 'Beverages',
        'bakers': 'Bakery Items',
        'chinese': 'Chinese Cuisine',
        'juices': 'Fresh Juices',
        'popular': 'Continental Dishes',
        'north-indian': 'North Indian',
        'south-indian': 'South Indian',
        'japanese': 'Japanese Cuisine',
        'other': 'World Cuisine'
    };
    
    categoryTitle.textContent = categoryNames[category] || 'Menu Items';
    categoryDescription.textContent = `Discover our delicious ${categoryNames[category]?.toLowerCase() || 'items'}`;
    
    // Clear container
    container.innerHTML = '';
    
    // Create food item cards
    items.forEach(item => {
        const card = createFoodCard(item);
        container.appendChild(card);
    });
}

// Create individual food item card
function createFoodCard(item) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    col.innerHTML = `
        <div class="food-item-card">
            <img src="${item.image}" alt="${item.name}" class="food-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'">
            <div class="food-content">
                <h3 class="food-title">${item.name}</h3>
                <p class="food-description">${item.description}</p>
                <div class="food-price">₹${item.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Add item to cart
function addToCart(itemId) {
    // Find item in all categories
    let item = null;
    for (let category in foodData) {
        item = foodData[category].find(i => i.id === itemId);
        if (item) break;
    }
    
    if (!item) return;
    
    // Check if item already exists in cart
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    
    // Show success feedback
    showToast(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Display cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Add some delicious items to get started!</p>
            </div>
        `;
        cartTotal.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Calculate and display total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total;
        cartTotal.style.display = 'block';
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('campusBiteCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('campusBiteCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully!\n\nTotal Amount: ₹${total}\n\nYour food will be delivered to your dorm within 15-20 minutes. Thank you for ordering from Campus Bite! 🍴`);
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    modal.hide();
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 2 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
