import expect from 'expect';
import counterReducer from '../reducer';
import { fromJS } from 'immutable';

describe('counterReducer', () => {
  it('returns the initial state', () => {
    expect(counterReducer(undefined, {})).toEqual(fromJS({}));
  });
});
