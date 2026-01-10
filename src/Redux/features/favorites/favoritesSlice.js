import {
  createSlice
} from "@reduxjs/toolkit";

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("favorites");
    if (serializedState === null) {
      return {
        items: []
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load favorites state from localStorage:", err);
    return {
      items: []
    };
  }
};

const initialState = loadStateFromLocalStorage();

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const {
        id,
        name,
        size,
        image,
        price_excl
      } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) {
        state.items.push({
          id,
          name,
          size,
          image,
          price_excl
        });
      }
      localStorage.setItem("favorites", JSON.stringify(state));
    },
    removeFromFavorites: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      localStorage.setItem("favorites", JSON.stringify(state));
    },
    toggleFavorite: (state, action) => {
      const {
        id,
        name,
        size,
        image,
        price_excl,
        vat,
        tax_amount,
        price_incl,
        empty_goods_value
      } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        state.items.push({
          id,
          name,
          size,
          image,
          price_excl,
          vat,
          tax_amount,
          price_incl,
          empty_goods_value
        });
      }
      localStorage.setItem("favorites", JSON.stringify(state));
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite
} =
favoritesSlice.actions;
export default favoritesSlice.reducer;