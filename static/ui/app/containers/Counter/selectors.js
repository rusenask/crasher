import { createSelector } from 'reselect';

/**
 * Direct selector to the counter state domain
 */
const selectCounterDomain = () => (state) => state.get('counter');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Counter
 */

const selectCounter = () => createSelector(
  selectCounterDomain(),
  (substate) => substate.toJS()
);

export default selectCounter;
export {
  selectCounterDomain,
};
