/*
 *
 * Counter reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  LOAD_COUNTER,
  LOAD_COUNTER_SUCCESS,
  LOAD_COUNTER_ERROR,
} from './constants';

const initialState = fromJS({
  loading: false,
  error: false,
  counter: {"count": 0}
});

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;

    case LOAD_COUNTER:
      return state
        .set('loading', true)
        .set('error', false)

    case LOAD_COUNTER_SUCCESS:
      return state
        .set('counter', action.count)
        .set('loading', false)

    case LOAD_COUNTER_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);


    default:
      return state;
  }
}

export default counterReducer;
