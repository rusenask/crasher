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
  SERVER_ADDRESS,  
} from './constants'


export function* getCount(action) {
  const requestURL = SERVER_ADDRESS + `/v1/count` ;

  const func = yield call(request, requestURL);

  if (!func.err) {
    yield put(counterLoaded(func.data));
  } else {
    console.log(func.err)
    yield put(counterLoadingError(func.err));
  }
}

export function* getCounterWatcher() {
   while (true) {
    
    const action = yield take(LOAD_COUNTER);
    yield call(getCount, action);
  }
}
// Individual exports for testing
export function* counterData() {
  // Fork watchers so we can continue execution
  const getc = yield fork(getCounterWatcher);


  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(getc);

}

// All sagas to be loaded
export default [
  counterData,
];
