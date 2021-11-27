import { configureStore } from '@reduxjs/toolkit';
import chartsReducer from '../features/clootrack/chartsSlice';

export const store = configureStore({
  reducer: {
    charts: chartsReducer,
  },
});
