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

  CRASH,

  RESET_COUNTER,
  RESET_COUNTER_ERROR,
  RESET_COUNTER_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function crashCounter() {
  return {
    type: CRASH,
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

export function resetCounter() {
  return {
    type: RESET_COUNTER,
  };
}

export function resetLoaded(count) {
  return {
    type: RESET_COUNTER_SUCCESS,
    count,    
  };
}

export function resetLoadingError(error) {
  return {
    type: RESET_COUNTER_ERROR,
    error,
  };
}