// import { take, call, put, select } from 'redux-saga/effects';
import { take, takeEvery, call, put, select, fork, cancel } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  counterLoaded,
  counterLoadingError,
} from './actions'

import {
  LOAD_COUNTER,
} from './constants'

// Individual exports for testing
export function* defaultSaga() {
  return;
}

// All sagas to be loaded
export default [
  defaultSaga,
];
