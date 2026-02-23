/**
 * Cart Logic for 源點身&心靈工作坊
 */

let cart = JSON.parse(localStorage.getItem('yuan_point_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCartUI();
    updateCartCount();
    renderCartItems();

    // Event Delegation for "Add to Cart"
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const name = btn.dataset.name;
            const basePrice = parseInt(btn.dataset.price);

            // Get selected option
            const card = btn.closest('.course-card');
            const select = card.querySelector('.option-select');
            const optionText = select.options[select.selectedIndex].text;

            // Simple logic: if text contains "+ NT$ XXX", add it to price
            let finalPrice = basePrice;
            const extraMatch = optionText.match(/\+ NT\$ ([\d,]+)/);
            if (extraMatch) {
                finalPrice += parseInt(extraMatch[1].replace(/,/g, ''));
            }

            addToCart({ name, option: optionText, price: finalPrice });
        }

        // Toggle Cart
        if (e.target.closest('#cart-toggle')) {
            document.getElementById('cart-sidebar').classList.add('active');
        }
        if (e.target.closest('#cart-close')) {
            document.getElementById('cart-sidebar').classList.remove('active');
        }
    });
});

function initCartUI() {
    // Basic sidebar layout exists in HTML
}

function addToCart(item) {
    cart.push({
        id: Date.now(),
        ...item
    });
    saveCart();
    updateCartCount();
    renderCartItems();

    // Open sidebar to show progress
    document.getElementById('cart-sidebar').classList.add('active');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(c => c.textContent = cart.length);
}

function saveCart() {
    localStorage.setItem('yuan_point_cart', JSON.stringify(cart));
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-amount');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; margin-top: 2rem;">購物車是空的</p>';
        totalEl.textContent = 'NT$ 0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                <div>
                    <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
                    <p style="margin: 4px 0; font-size: 0.85rem; color: #666;">${item.option}</p>
                    <span style="font-weight: bold; color: var(--accent-color);">NT$ ${item.price.toLocaleString()}</span>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4757; cursor: pointer; font-size: 0.8rem;">移除</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = `NT$ ${total.toLocaleString()}`;
}

// Make globally accessible for the onclick attribute
window.removeFromCart = removeFromCart;
