// This creates a Redux store, and also automatically configure the Redux DevTools extension so that you can inspect the store while developing.
import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice';
import activate from './activateSlice';

export const store = configureStore({
  reducer: {
    auth,
    activate,
  },
})

