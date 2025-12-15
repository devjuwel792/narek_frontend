import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import ordersReducer from "./features/orders/ordersSlice";

import { authApi } from "./services/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    // Add the generated reducer as a specific top-level slice
    
    [authApi.reducerPath]: authApi.reducer,
 
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
   
      authApi.middleware,
     
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
