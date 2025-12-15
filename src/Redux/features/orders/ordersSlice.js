import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action) => {
      const { cartItems, deliveryData } = action.payload;
      const newOrder = {
        id: Date.now(), // Simple ID generation
        items: cartItems,
        deliveryData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      state.orders.push(newOrder);
      state.currentOrder = newOrder;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { placeOrder, updateOrderStatus, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
