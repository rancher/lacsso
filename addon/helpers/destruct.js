import Ember from 'ember';

export function destruct(params/*, hash*/) {
  return params[0].join(' ');
}

export default Ember.Helper.helper(destruct);
