// import { take, call, put, select } from 'redux-saga/effects';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  counterLoaded,
  counterLoadingError,

  resetLoaded,
  resetLoadingError,
} from './actions';

import {
  CRASH,
  RESET_COUNTER,
  LOAD_COUNTER,
  // SERVER_ADDRESS,
} from './constants';


export function* getCount() {
  // const requestURL = SERVER_ADDRESS + `/v1/count`;
  const requestURL = '/v1/count';

  const func = yield call(request, requestURL);

  if (!func.err) {
    yield put(counterLoaded(func.data));
  } else {
    yield put(counterLoadingError(func.err));
  }
}

export function* getCounterWatcher() {
  while (true) {
    const action = yield take(LOAD_COUNTER);
    yield call(getCount, action);
  }
}

// RESET
export function* resetCount(action) {
  // const requestURL = SERVER_ADDRESS + `/v1/reset`;
  const requestURL = '/v1/reset';

  const func = yield call(request, requestURL);

  if (!func.err) {
    yield put(resetLoaded(func.data));
    yield call(getCount, action);
  } else {
    yield put(resetLoadingError(func.err));
  }
}

export function* resetCounterWatcher() {
  while (true) {
    const action = yield take(RESET_COUNTER);
    yield call(resetCount, action);
  }
}

// CRASH it
export function* crashCounter(action) {
  // const requestURL = SERVER_ADDRESS + `/v1/crash`;
  const requestURL = '/v1/crash';

  const func = yield call(request, requestURL);

  if (!func.err) {
    yield call(getCount, action);
  } else {
    yield put(resetLoadingError(func.err));
  }
}

export function* crashCounterWatcher() {
  while (true) {
    const action = yield take(CRASH);
    yield call(crashCounter, action);
  }
}


// Individual exports for testing
export function* counterData() {
  // Fork watchers so we can continue execution
  const getc = yield fork(getCounterWatcher);
  const reset = yield fork(resetCounterWatcher);
  const crash = yield fork(crashCounterWatcher);


  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(getc);
  yield cancel(reset);
  yield cancel(crash);
}
// All sagas to be loaded
export default [
  counterData,
];
