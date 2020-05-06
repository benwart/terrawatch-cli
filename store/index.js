'use strict';

import { configureStore } from '@reduxjs/toolkit';
import workReducer from './workSlice';

const store = configureStore({
  reducer: workReducer,
  devTools: false
})

export default store;