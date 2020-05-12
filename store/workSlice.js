'use strict';

import { createSlice } from '@reduxjs/toolkit';

export const STATE_DEFINED = 'DEFINED';
export const STATE_RUNNING = 'RUNNING';
export const STATE_COMPLETED = 'COMPLETED';
export const STATE_ERROR = 'ERROR';

let completedOrder = 0;

const workSlice = createSlice({
  name: 'work',
  initialState: [],
  reducers: {
    define: {
      reducer(state, action) { 
        const { id, resource, work } = action.payload;
        state.push({ 
          id, 
          resource, 
          work, 
          state: STATE_DEFINED, 
          duration: 0 
        });
      },
      prepare(id, resource, work) {
        return { payload: { id, resource, work } };
      }
    },
    run: {
      reducer(state, action) {
        const { id, duration } = action.payload;
        const item = state.find(item => item.id === id);
        if (item) {
          item.state = STATE_RUNNING;
          item.duration = duration;
        }
      },
      prepare(id, duration) {
        return { payload: { id, duration } };
      }
    },
    complete: {
      reducer(state, action) {
        const { id, duration, order } = action.payload;
        const item = state.find(item => item.id === id);
        if (item) {
          item.state = STATE_COMPLETED;
          item.duration = duration;
          item.order = order;
        }
      },
      prepare(id, duration) {
        return { payload: { id, duration, order: completedOrder++ } };
      }
    },
    error: {
      reducer(state, action) {
        const { id, duration, error } = action.payload;
        const item = state.find(item => item.id === id);
        if (item) {
          item.state = STATE_ERROR;
          item.duration = duration;
          item.error = error;
        }
      },
      prepare(id, duration, error) {
        return { payload: { id, duration, error } };
      }
    }
  }
});

export const {define, run, complete, error} = workSlice.actions;

export default workSlice.reducer;