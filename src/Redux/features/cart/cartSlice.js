import { createSlice } from "@reduxjs/toolkit";

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return {
        items: [],
        totalItems: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load cart state from localStorage:", err);
    return {
      items: [],
      totalItems: 0,
    };
  }
};

const initialState = loadStateFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      
      const {
        id,
        name,
        size,
        image,
        quantity = 1,
        price,
        tax,
        price_tax_incl,
        vat,
        userId,
        empty_goods_value,
      } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        
        state.items.push({
          id,
          name,
          size,
          image,
          quantity,
          price,
          tax,
          userId,
          price_tax_incl,
          vat,
          empty_goods_value,
        });
      }
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      
      const { id, quantity ,userId } = action.payload;
      const item = state.items.find((item) => item.id === id && item.userId === userId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
