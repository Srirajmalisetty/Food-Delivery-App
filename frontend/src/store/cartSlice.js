import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
    },
    clearCartLocal: (state) => {
      state.restaurantId = null;
      state.restaurantName = null;
      state.items = [];
      state.totalAmount = 0;
    }
  }
});

export const { setCart, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
