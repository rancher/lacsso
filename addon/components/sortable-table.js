import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable-base';
import StickyHeader from '../mixins/sticky-table-header';
import pagedArray from 'ember-cli-pagination/computed/paged-array';

const {get,set} =              Ember;

export default Ember.Component.extend(Sortable, StickyHeader, {
  layout,
  body:              null,
  sorts:             null,
  sortBy:            null,
  headers:           null,
  sortableContent:   Ember.computed.alias('body'),
  selectAll:         false,
  bulkActionsList:   null,
  availableActions:  null,
  selectedNodes:     null,
  includeActions:    true,
  bulkActionCallee:  null,
  page: 1,
  perPage: 10,
  pagedContent: pagedArray('arranged', {pageBinding: "page", perPageBinding: "perPage"}),

  pageCountContent: Ember.computed('pagedContent.[]', function() {
    var content = this.get('pagedContent');
    var current = content.get('page');
    var perPage = content.get('perPage');
    var count = content.get('content.length') || 0;
    var offset = (current -1) * perPage + 1;
    // the actual count of items on the page
    var offsetTo = offset + (this.get('pagedContent.arrangedContent.length') - 1);
    return `${offset} to ${offsetTo} of ${count}`;
  }),
  init: function() {
    this._super(...arguments);
    this.set('selectedNodes', []);
    this.set('availableActions', this.get('bulkActionsList'));
  },

  actions: {
    executeBulkAction: function(name) {
      this.get('bulkActionCallee')(name, this.get('selectedNodes'));
    },
    executeAction: function(action) {
      var node = this.get('selectedNodes')[0];
      node.send(action);
    },
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
        selectedNodes.pushObject(node);
      }
      this.mergeAvailableActions(selectedNodes);
      this.notifyPropertyChange('selectedNodes');
    },
    selectUnselectAll: Ember.observer('selectAll', function() {
      let selectAll = this.get('selectAll');
      if (selectAll) {
        selectAll = this.set('selectAll', false);
        this.setProperties({
          selectedNodes: [],
          availableActions: this.get('bulkActionsList')
        });
      } else {
        selectAll = this.set('selectAll', true);
        this.set('selectedNodes', this.get('body'));
        this.mergeAvailableActions(this.get('body'));
      }
    }),
    triggerBulkActions: function(actionName) {
      var nodes = this.get('selectedNodes');

      nodes.forEach((node) => {
        node.send(actionName);
      });
    }
  },
  mergeAvailableActions: function(data) { //selectedNodes
    var out = null;

    if (data.length > 1) {
      out = this.mergeBulkActions(data);
    } else if (data.length === 1) {
      out = this.mergeSingleActions(data[0]);
    } else {
      out = this.get('bulkActionsList');
    }

    this.set('availableActions', out);
    this.notifyPropertyChange('availableActions');
  },

  mergeBulkActions: function(nodes) {
    var commonActions = Ember.$().extend(true, [], this.get('bulkActionsList'));
    var localActions = [];

    // loop over every selectedNode to find available actions
    nodes.forEach((item, idx) => {
      let actions = get(item, 'availableActions').filter((action) => {
        return action.enabled && action.bulkable;
      });

      if (idx === 0) {
        localActions = actions;
      }

      commonActions.forEach((action) => {
        if (!actions.findBy('action', action.action)) {
          set(action, 'disabled', true);
        }
      });

    });

    return commonActions;
  },

  mergeSingleActions: function(node) {
    var commonActions = Ember.$().extend(true, [], this.get('bulkActionsList'));
    var localActions = [];
    // no others selected just push the availabe actions out
    localActions = get(node, 'availableActions').filter((action) => {
      return action.enabled;
    });
    // combine both arrays into a unique set
    commonActions = commonActions.concat(localActions).uniqBy('action');
    // find items that need to be disbaled
    commonActions.forEach((action) => {
      if (!localActions.findBy('action', action.action)) {
        set(action, 'disabled', true);
      }
    });
    return commonActions;
  },
});
