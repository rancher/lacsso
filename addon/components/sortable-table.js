import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable';
import StickyHeader from '../mixins/sticky-table-header';

export default Ember.Component.extend(Sortable, StickyHeader, {
  layout,
  tagName: 'TABLE',
  classNames: ['fixed'],
  tableData: null,
  tableHeaders: null,
  sortableContent: Ember.computed.alias('tableData'),
});
