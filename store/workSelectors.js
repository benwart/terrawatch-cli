'use strict';

import { createSelector } from '@reduxjs/toolkit';
import { STATE_DEFINED, STATE_RUNNING, STATE_COMPLETED, STATE_ERROR } from './workSlice';

const selectWork = state => state;

export const selectDefinedWork = createSelector([selectWork], work => {
  return work.filter(item => item.state === STATE_DEFINED);
});

export const selectRunningWork = createSelector([selectWork], work => {
  return work.filter(item => item.state === STATE_RUNNING);
});

export const selectCompletedWork = createSelector([selectWork], work => {
  return work
    .filter(item => item.state === STATE_COMPLETED)
    .sort((a, b) => a.order - b.order);
});

export const selectErrorWork = createSelector([selectWork], work => {
  return work.filter(item => item.state === STATE_ERROR);
});
