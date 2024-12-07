let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let cartShow = document.querySelector('.cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let total = document.querySelector('.totalPrice');
let totalSub = document.querySelector('.totalSub');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


/* Hide and Show Cart */
iconCart.addEventListener('click', () => {
    cartShow.classList.add("show");
});

closeCart.addEventListener('click', () => {
    cartShow.classList.remove("show");
})

/*Append Product Data*/
const addDataToHTML = () => {
    if(products.length > 0)
    {
        products.forEach(product => {
            let newProduct = document.createElement('li');
            newProduct.dataset.id = product.id;
            newProduct.dataset.price = product.salePrice === 0 ? product.price : product.salePrice;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <p>${product.name}</p>
            <div class="priceContainer">
                <p class="sale ${product.salePrice === 0 ? 'hideSalePrice' : 'showSalePrice'}">$${product.salePrice}</p>
                <p class="price ${product.salePrice !== 0 ? 'underline' : 'removeunderline'}">$${product.price}</p>
            </div>
            <p class="addCart">Buy</p>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

/* Add to Cart */
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let id_product = positionClick.parentElement.dataset.id;
        let price_product = positionClick.parentElement.dataset.price;

        addToCart(id_product,price_product);
    }
})

const addToCart = (product_id,price_product) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1,
            price: price_product
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1,
            price: price_product
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
        cart[positionThisProductInCart].price = cart[positionThisProductInCart].quantity * price_product;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPriceOverAll = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            totalPriceOverAll = totalPriceOverAll + item.price;
            let newItem = document.createElement('li');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.dataset.price = item.price;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                    <p>${info.name}</p>
                </div>
                <div class="qty">
                    <p>${item.quantity}</p>
                </div>
                <div class="totalPrice"> ${info.salePrice == 0 ? info.price * item.quantity : info.salePrice * item.quantity}</div>

                <div class="cancelProduct">
                    <span class="delete">X</span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity > 0 ? totalQuantity : '';
    console.log(totalPriceOverAll);
    totalSub.innerHTML = `<p class="totalAmount">Total: $${totalPriceOverAll > 0 ? totalPriceOverAll : 0}</p>`
}

/*Delete cartItem*/
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    let product_id = positionClick.parentElement.parentElement.dataset.id;
        deleteCartProduct(product_id);
});

const deleteCartProduct = (product_id) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    cart.splice(positionItemInCart, 1);
    addCartToHTML();
    addCartToMemory();
}

/* read Product Json File*/
const initApp = () => {
    fetch('js/products.json')
    .then(res => res.json())
    .then(data => {
        products = data;
        addDataToHTML();
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();