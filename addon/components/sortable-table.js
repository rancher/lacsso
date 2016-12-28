import Ember from 'ember';
import layout from '../templates/components/sortable-table';
import Sortable from '../mixins/sortable-base';
import StickyHeader from '../mixins/sticky-table-header';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import {isMore, isRange} from '../utils/platform';

const {get,set} =              Ember;

export default Ember.Component.extend(Sortable, StickyHeader, {
  layout,
  body:              null,
  sorts:             null,
  sortBy:            null,
  headers:           null,
  sortableContent:   Ember.computed.alias('body'),
  bulkActionsList:   null,
  availableActions:  null,
  selectedNodes:     null,
  includeActions:    true,
  bulkActionCallee:  null,
  previousClick:     null,
  searchText:        null,
  originalResults:   null,
  page:              1,
  perPage:           10,
  pagedContent:      pagedArray('arranged', {pageBinding:  "page", perPageBinding:  "perPage"}),


  init: function() {
    this._super(...arguments);

    this.set('selectedNodes', []);
    // this.set('availableActions', this.get('bulkActionsList'));

    Ember.run.schedule('afterRender', () => {
      this.setupCheckListeners();
    });
  },

  pageChanged: Ember.observer('pagedContent.page', function() {
    if (this.get('selectedNodes')) {
      this.mergeAvailableActions(this.set('selectedNodes', []));
      Ember.$(this.element).find('thead tr th input[type="checkbox"]').prop('checked', false);
      Ember.run.schedule('afterRender', () => {
        this.setupCheckListeners();
      });
    }
  }),

  pageCountContent: Ember.computed('pagedContent.[]', function() {
    var out = null;
    var content =  this.get('pagedContent');
    var current =  content.get('page');
    var perPage =  content.get('perPage');
    var count =    content.get('content.length') || 0;
    var offset =   (current -1) * perPage + 1;
    // the actual count of items on the page
    var offsetTo = offset + (this.get('pagedContent.arrangedContent.length') - 1);

    if (content.get('totalPages') <= 1) {
      out = `${count} items`;
    } else {
      out = `${offset} to ${offsetTo} of ${count}`;
    }

    return out;
  }),

  searchObserver: Ember.observer('searchText', function() {
    var allContent =       this.get('arranged');
    var originalResults =  this.get('originalResults');
    var selectedNodes = this.get('selectedNodes');
    var searchedResults =  [];
    var searchText =       this.get('searchText');
    var searchFields =     [];
    var nodesToRemove =    [];

    this.get('headers').forEach((header) => {
      if (get(header, 'searchField')) {
        searchFields.push(get(header, 'searchField'));
      } else {
        searchFields.push(get(header, 'name'));
      }
    });

    if (searchText.length < 1) {
      if (originalResults) {
        this.set('body', originalResults);
        this.set('originalResults', null);
        return false;
      }

    }
    if (!originalResults) {
      originalResults = this.set('originalResults', allContent);
    }

    originalResults.forEach((item) => {
      searchFields.forEach((field) => {
        if (field && field.length > 0) {
          if (item.get(field) && item.get(field).indexOf(searchText) !== -1) {
            searchedResults.push(item);
          }
        }
      });
    });

    // if we have any nodes that were removed by the search then we should remove them from
    // the selected nodes list
    selectedNodes.forEach((selected) => {
      if (!searchedResults.findBy('id', selected.get('id'))) {
        nodesToRemove.push(selected);
      }
    });

    this.send('selectUnselectMulti', [], nodesToRemove);

    this.set('body', searchedResults.uniqBy('id'));

  }),

  toggleRowClass: Ember.observer('selectedNodes.[]', function() {
    var selectedNodes = this.get('selectedNodes');
    if (selectedNodes.length > 1) {
      this.get('selectedNodes').forEach((node) => {
        let input = Ember.$(`input[nodeid=${node.get('id')}]`);
        let checked = input.is(':checked');
        if (checked) {
          Ember.$(input).closest('tr').addClass('row-selected');
        } else {
          Ember.$(input).closest('tr').removeClass('row-selected');
        }
      });
    } else {
      let $checkboxes = Ember.$(this.element).find('table tbody input[type="checkbox"]');
      $checkboxes.each((idx, checkbox) => {
        let checked = Ember.$(checkbox).is(':checked');
        if (checked) {
          Ember.$(checkbox).closest('tr').addClass('row-selected');
        } else {
          Ember.$(checkbox).closest('tr').removeClass('row-selected');
        }
      });
    }
  }),

  buildTRSelections: function(e) {
    let el = Ember.$(e.currentTarget).find('input[type="checkbox"]');

    if (el.is(':checked')) {

      el.prop('checked', false);
      this.send('selectUnselectMulti', [], [this.get('pagedContent.content').findBy('id', el.attr('nodeid'))]);
    } else {
      let selectedNodes = this.get('selectedNodes');
      let nodesToRemove = [];
      let nodesToAdd = [];
      let node = this.get('pagedContent.content').findBy('id', el.attr('nodeid'));

      el.prop('checked', true);

      if (isMore(e)) {

        nodesToAdd.push(node);

        selectedNodes.forEach((selected) => {
          if (selected.get('id') !== node.get('id')) {
            nodesToAdd.push(node);
          }
        });

        this.send('selectUnselectMulti', nodesToAdd, []);

      } else if (isRange(e)) {
        document.getSelection().removeAllRanges();
        let $checkboxes = el.closest('table').find('tbody input[type="checkbox"]');
        let start = $checkboxes.index(el[0]);
        let end = $checkboxes.index(this.get('previousClick'));

        this.buildRangeSelections(start, end, $checkboxes);
      } else {

        if (selectedNodes.length) {
          selectedNodes.forEach((selected) => {
            let id = selected.get('id');
            Ember.$(`input[nodeId=${id}]`).prop('checked', false);
            nodesToRemove.push(selected);
          });

          if (node) {
            nodesToAdd.push(node);
          }

          this.send('selectUnselectMulti', nodesToAdd, nodesToRemove);
        } else {
          this.send('selectUnselectSingle', node);
        }
      }
    }
  },

  buildRangeSelections: function(start, end, checkboxes) {
    let prevClick = this.get('previousClick');
    let content   = this.get('pagedContent.content');
    // this returns all the boxs betweent he origianl click and the last click with shift held
    let $selectedNodes        = checkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).prop('checked', prevClick.checked);
    let selectedNodesToAdd    = [];
    let selectedNodesToRemove = [];

    $selectedNodes.each((idx, node) => {
      if (Ember.$(node).is(':checked')) {
        // we have to check if its in the selectedNodesToAdd array because the first click before shift click will be there already
        if (!selectedNodesToAdd.findBy('id', Ember.$(node).attr('nodeid'))) {
          selectedNodesToAdd.push(content.findBy('id', Ember.$(node).attr('nodeid')));
        }
      } else {
        selectedNodesToRemove.push(content.findBy('id', Ember.$(node).attr('nodeid')));
      }
    });
    this.send('selectUnselectMulti', selectedNodesToAdd, selectedNodesToRemove);
  },

  setupCheckListeners: function() {
    var $e =    Ember.$;
    var el =    $e(this.element).find('table');
    var that =  this; // need this context in click function and can't use arrow func there

    el.find('tbody tr').on('click', function(e) {
      let type = e.currentTarget.tagName;
      let mustPropigate = Ember.$(e.target).parent().hasClass('must-propigate');
      let nodeId = null;
      let prevClick =    that.get('previousClick');
      let content =      that.get('pagedContent.content');

      if (type === 'TR' && !mustPropigate) {

        if (e.target.tagName !== 'INPUT' && !Ember.$(e.target).hasClass('select-for-action')) {
          if (!prevClick) {
            that.set('previousClick', Ember.$(this).find('input[type="checkbox"]')[0]);
          }
          that.buildTRSelections(e);
          that.set('previousClick', Ember.$(this).find('input[type="checkbox"]')[0]);
        } else {
          nodeId = $e(e.currentTarget).find('input[type="checkbox"]').attr('nodeid');
          let $checkboxes =  el.find('input[type="checkbox"]');

          if (Ember.$(e.target).hasClass('select-for-action')) {
            Ember.$(e.target).find('input[type="checkbox"]').prop('checked', true);
          }

          if (!prevClick) {
            that.set('previousClick', Ember.$(this).find('input[type="checkbox"]')[0]);
          }

          if (e.shiftKey) {

            let start = $checkboxes.index(Ember.$(this).find('input[type="checkbox"]'));
            let end =  $checkboxes.index(prevClick);

            that.buildRangeSelections(start, end, $checkboxes);

          }  else {

            that.send('selectUnselectSingle', content.findBy('id', nodeId));
          }
          that.set('previousClick', Ember.$(this).find('input[type="checkbox"]')[0]);
        }

      }
    });
  },

  clearAllNodes: function() {
    var nodes = [];
    var $checkboxes = Ember.$(this.element).find('table tbody input[type="checkbox"]');
    var content = this.get('pagedContent.content');
    $checkboxes.each((idx, checkbox) => {
      let $node = Ember.$(checkbox);
      let nodeId = $node.attr('nodeid');
      $node.prop('checked', false);
      nodes.push(content.findBy('id', nodeId));
    });
    this.send('selectUnselectMulti', [], nodes);
  },
  actions: {
    clearSearch: function() {
      this.set('searchText', '');
    },
    executeBulkAction: function(name) {
      this.get('bulkActionCallee')(name, this.get('selectedNodes'));
    },
    executeAction: function(action) {
      var node = this.get('selectedNodes')[0];
      node.send(action);
    },
    selectAll: function(e) {
      var nodes = [];
      var $checkboxes = Ember.$(this.element).find('table tbody input[type="checkbox"]');
      var checked = Ember.$(e.currentTarget).is(':checked');
      var content = this.get('pagedContent.content');

      $checkboxes.each((idx, checkbox) => {
        let $node = Ember.$(checkbox);
        let nodeId = $node.attr('nodeid');
        if (checked) {
          $node.prop('checked', true);
        } else {
          $node.prop('checked', false);
        }
        nodes.push(content.findBy('id', nodeId));
      });
      if (checked) {
        this.send('selectUnselectMulti', nodes, []);
      } else {
        this.send('selectUnselectMulti', [], nodes);
      }
    },

    selectUnselectMulti: function(nodesToAdd, nodesToRemove) {
      let selectedNodes =     this.get('selectedNodes');

      if (nodesToAdd.length) {
        nodesToAdd.forEach((node) => {
          if (!selectedNodes.findBy('id', node.id)) {
            selectedNodes.pushObject(node);
          }
        });
      }
      if (nodesToRemove.length) {
        nodesToRemove.forEach((node) => {
          selectedNodes.removeObject(node);
        });
      }

      this.mergeAvailableActions(selectedNodes);
    },

    selectUnselectSingle: function(node) {
      let selectedNodes =  this.get('selectedNodes');
      let indexOfNode =    -1;

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
    },
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
    }

    this.set('availableActions', out);
    this.notifyPropertyChange('availableActions');
  },

  mergeBulkActions: function(nodes) {
    var commonActions =  Ember.$().extend(true, [], this.get('bulkActionsList'));

    // loop over every selectedNode to find available actions
    nodes.forEach((item, idx) => {
      let actions = get(item, 'translatedAvaileableActions').filter((action) => {
        return action.enabled && action.bulkable;
      });

      commonActions.forEach((action) => {
        if (!actions.findBy('action', action.action)) {
          set(action, 'disabled', true);
        }
      });

    });

    return commonActions;
  },

  mergeSingleActions: function(node) {
    var commonActions =  Ember.$().extend(true, [], this.get('bulkActionsList'));
    var localActions =   [];

    // no others selected just push the availabe actions out
    localActions = get(node, 'translatedAvaileableActions').filter((action) => {
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
