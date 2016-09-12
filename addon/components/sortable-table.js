import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable';

export default Ember.Component.extend(Sortable, {
  layout,
  tagName: 'TABLE',
  classNames: ['fixed'],
  tableData: null,
  tableHeaders: null,
  sortableContent: Ember.computed.alias('tableData'),
  didReceiveAttrs() {
  },
});
