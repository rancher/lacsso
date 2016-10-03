import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable-base';
import StickyHeader from '../mixins/sticky-table-header';

const {get} = Ember;

export default Ember.Component.extend(Sortable, StickyHeader, {
  layout,
  tagName: 'TABLE',
  classNames: ['fixed'],
  body: null,
  headers: null,
  sortableContent: Ember.computed.alias('body'),
  selectAll: false,
  availableActions: null,
  selectedNodes: [],
  includeActions: true,
  //init() {
    //this._super(...arguments);
    //debugger;
  //},
  actions: {
    selectUnselect: function(node) {
      let selectedNodes = this.get('selectedNodes');
      let indexOfNode = -1;

      let nodeExists = selectedNodes.find((item, index) => {
        if (node === item) {
          indexOfNode = index;
          return true;
        }
        indexOfNode = -1;
        return false;
      });

      if (nodeExists) {
        selectedNodes.splice(indexOfNode, 1);
      } else {
        selectedNodes.push(node);
      }
    },
    selectUnselectAll: Ember.observer('selectAll', function() {
      let selectAll = this.get('selectAll');
      if (selectAll) {
        selectAll = this.set('selectAll', false);
        this.set('selectedNodes', []);
        this.set('availableActions', null);
      } else {
        selectAll = this.set('selectAll', true);
        this.set('selectedNodes', this.get('body'));
        this.mergeAvailableActions(this.get('body'));
      }
    }),
    triggerBulkActions: function(actionName) {
      this.get(`availableActions.${actionName}`);
    }
  },
  mergeAvailableActions: function(data) {
    let commonActions = {};
    data.forEach((item, idx) => {
      let actionKeys = Object.keys(get(item, 'actions'));
      if (idx === 0) {
        let temp = {};
        actionKeys.forEach((key) => {
          temp[key] = [get(item.actions, key)];
        });
        commonActions = temp;
        return;
      }

      actionKeys.forEach((key) => {
        if (commonActions[key]) {
          commonActions[key].push(get(item.actions, key));
        }
      });
    });
    this.set('availableActions', commonActions);
  }
});
