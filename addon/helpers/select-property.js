import Ember from 'ember';

export function selectProperty(params/*, hash*/) {
  var [objToSelect, property] = params;
  return objToSelect[property];
}

export default Ember.Helper.helper(selectProperty);
