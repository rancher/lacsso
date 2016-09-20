import Ember from 'ember';
import layout from '../templates/components/check-box';

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  checked: false,
  classNameBindings: ['checked'],
  classNames: ['icon-stack', 'checkbox'],
  click() {
    this.toggleProperty('checked');
    this.attrs.clickHappened();
  },
  allSelected: Ember.observer('selectAll', function() {
    if (this.get('selectAll')) {
      this.set('checked', true);
    } else {
      this.set('checked', false);
    }
  })
});
