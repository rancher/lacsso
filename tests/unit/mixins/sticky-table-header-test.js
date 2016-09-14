import Ember from 'ember';
import StickyTableHeaderMixin from 'lacsso/mixins/sticky-table-header';
import { module, test } from 'qunit';

module('Unit | Mixin | sticky table header');

// Replace this with your real tests.
test('it works', function(assert) {
  let StickyTableHeaderObject = Ember.Object.extend(StickyTableHeaderMixin);
  let subject = StickyTableHeaderObject.create();
  assert.ok(subject);
});
