import Ember from 'ember';
import ThrottledResizeMixin from 'lacsso/mixins/throttled-resize';
import { module, test } from 'qunit';

module('Unit | Mixin | throttled resize');

// Replace this with your real tests.
test('it works', function(assert) {
  let ThrottledResizeObject = Ember.Object.extend(ThrottledResizeMixin);
  let subject = ThrottledResizeObject.create();
  assert.ok(subject);
});
