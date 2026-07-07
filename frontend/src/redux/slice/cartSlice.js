import { createSlice } from '@reduxjs/toolkit';

// Cart is stored per user (guest cart uses its own key too)
const getCartKey = (userId) => `cartItems_${userId || 'guest'}`;

const initialState = {
  cartItems: [],
  userId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Call this right after login (with the user's id) and once on app
    // startup if a user is already logged in, to load their saved cart.
    setCartUser: (state, action) => {
      const userId = action.payload;
      state.userId = userId;

      const stored = localStorage.getItem(getCartKey(userId));
      state.cartItems = stored ? JSON.parse(stored) : [];
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.productId === item.productId);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem(getCartKey(state.userId), JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
      localStorage.setItem(getCartKey(state.userId), JSON.stringify(state.cartItems));
    },

    // Used on logout: hides the cart from view without deleting the
    // user's saved data, so it reloads next time they log in.
    clearCart: (state) => {
      state.cartItems = [];
      state.userId = null;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartUser } = cartSlice.actions;
export default cartSlice.reducer;