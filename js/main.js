let eventBus = new Vue();

Vue.component('product-review', {
    template: `
<form class="review-form" @submit.prevent="onSubmit">
<p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>
 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            } else {
                this.errors = [];
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
            }
        }
    }
});

Vue.component('product', {
    props: ['product', 'premium', 'cart'],
    template: `
   <div class="product">
       <div class="product-image">
           <img :src="product.image" :alt="product.altText"/>
       </div>
       <div class="product-info">
           <h1>{{ product.brand }} {{ product.name }}</h1>
           <p v-if="product.inStock">In stock</p>
           <p v-else>Out of Stock</p>
           <ul>
               <li v-for="detail in product.details">{{ detail }}</li>
           </ul>
          <p>Shipping: {{ shipping }}</p>
           <button
                   @click="$emit('add-to-cart', product.id)"
                   :disabled="!product.inStock"
                   :class="{ disabledButton: !product.inStock }"
           >
               Add to cart
           </button>  
       </div>  
       <product-review></product-review>
   </div>
 `,
    computed: {
        shipping() {
            return this.premium ? "Free" : "2.99";
        }
    }
});

Vue.component('catalog', {
    props: ['premium', 'cart'],
    template: `
    <div>
        <product 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
            :premium="premium" 
            :cart="cart"
            @add-to-cart="$emit('add-to-cart', product.id)"
            @delete-item="$emit('delete-item', product.id)"></product>
    </div>
    `,
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: "Socks",
                    brand: "Vue Mastery",
                    image: "./assets/vmSocks-green-onWhite.jpg",
                    altText: "A pair of green socks",
                    inStock: true,
                    details: ["80% cotton", "20% polyester", "Gender-neutral"],
                    reviews: []
                },
                {
                    id: 2,
                    name: "Hat",
                    brand: "Vue Mastery",
                    image: "./assets/vmSocks-blue-onWhite.jpg",
                    altText: "A blue hat",
                    inStock: true,
                    details: ["100% wool", "Unisex", "Warm for winter"],
                    reviews: []
                }
            ]
        }
    }
});

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Catalog'">
         <catalog :premium="premium" :cart="cart" @add-to-cart="$emit('add-to-cart', $event)"></catalog>
       </div>
       <div v-show="selectedTab === 'Basket'">
         <p v-if="cart.length === 0">Your cart is empty.</p>
         <ul>
           <li v-for="(item, index) in cart" :key="index">
             <p>Product ID: {{ item }}</p>
             <button @click="$emit('delete-item', index)">Delete</button>
           </li>
         </ul>
       </div>
     </div>
`,
    props: ['premium', 'cart'],
    data() {
        return {
            tabs: ['Catalog', 'Basket'],
            selectedTab: 'Catalog'
        }
    }
});


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteFromCart(index) {
            this.cart.splice(index, 1);
        }
    }
});
