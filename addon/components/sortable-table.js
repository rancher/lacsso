import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable';
import StickyHeader from '../mixins/sticky-table-header';

const {set} = Ember;

export default Ember.Component.extend(Sortable, StickyHeader, {
  layout,
  tagName: 'TABLE',
  classNames: ['fixed'],
  body: null,
  headers: null,
  sortableContent: Ember.computed.alias('body'),
  selectAll: false,
  setAllSelected: Ember.observer('selectAll', function() {
    let selectAll = this.get('selectAll');
    let tableData = this.get('body');
    this.set('body', tableData.map((item) => {
      set(item, 'selected', selectAll);
      return item;
    }));
  }),
});
