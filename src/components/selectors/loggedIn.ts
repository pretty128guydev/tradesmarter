/**
 * Account selectors
 * https://github.com/reduxjs/reselect#creating-a-memoized-selector
 */
// import { createSelector } from 'reselect'

const isLoggedIn = (state: any): boolean => state.account.loggedIn

export { isLoggedIn }