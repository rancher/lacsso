import Ember from 'ember';

const {get} = Ember;

export function selectProperty(params/*, hash*/) {
  var [objToSelect, property] = params;
  return get(objToSelect, property);
}

export default Ember.Helper.helper(selectProperty);
