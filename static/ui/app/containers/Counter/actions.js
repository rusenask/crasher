/*
 *
 * Counter actions
 *
 */

import {
  DEFAULT_ACTION,
  LOAD_COUNTER,
  LOAD_COUNTER_SUCCESS,
  LOAD_COUNTER_ERROR,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}


export function loadCounter() {
  return {
    type: LOAD_COUNTER,
  };
}

export function counterLoaded(count) {
  return {
    type: LOAD_COUNTER_SUCCESS,
    count,    
  };
}

export function counterLoadingError(error) {
  return {
    type: LOAD_COUNTER_ERROR,
    error,
  };
}