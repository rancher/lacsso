import Ember from 'ember';
import ThrottledResize from './throttled-resize';

export default Ember.Mixin.create(ThrottledResize, {
  bulkActions: false,
  didInsertElement() {
    let $offset = Ember.$(this.element).find('thead tr').offset().top;

    if (this.get('bulkActions')) {
      Ember.$(this.element).find('thead .fixed-header-actions').css('width', Ember.$(this.element).outerWidth());
    }
    Ember.$(window).scroll(() => {
      this.updateHeaders($offset);
    });

  },
  willDestroyElement() {
    this._super(...arguments);
    Ember.$(window).unbind('scroll');
  },

  onResize() {
    this.buildTableWidths();
  },


  buildTableWidths() {
    let ths = Ember.$(this.element).find('thead tr.fixed-header th');

    Ember.$(this.element).find('thead tr.fixed-header-placeholder th').each((idx, th) => {
      Ember.$(ths[idx]).attr('width', Ember.$(th).outerWidth());
    });

    if (this.get('bulkActions')) {
      Ember.$(this.element).find('thead .fixed-header-actions').css({
        'width': Ember.$(this.element).width(),
      });
    }
  },

  tearDownTableWidths() {
    Ember.$(this.element).find('thead tr.fixed-header th').each((idx, td) => {
      Ember.$(td).removeAttr('width');
    });
  },

  positionHeaders() {
    let $table       = Ember.$(this.element);
    let $actionRow   = $table.find('thead .fixed-header-actions');
    let $fixedHeader = $table.find('thead tr.fixed-header');

    if (this.get('bulkActions')) {
      $actionRow.css({
        'position': 'fixed',
        'top': 0,
      });
    }
    $fixedHeader.css({
      'position': 'fixed',
      'top': $actionRow.height() || 0,
    });
  },

  removePositions() {
    let $table       = Ember.$(this.element);
    let $actionRow   = $table.find('thead .fixed-header-actions');
    let $fixedHeader = $table.find('thead tr.fixed-header');

    if (this.get('bulkActions')) {
      $actionRow.css({
        'position': '',
        'top': '',
      });
    }
    $fixedHeader.css({
      'position': '',
      'top': '',
    });
  },

  updateHeaders(offset) {
    let $windowScroll   = Ember.$(window).scrollTop();
    let $table          = Ember.$(this.element);
    let $floatingHeader = $table.find('thead tr.fixed-header');
    let $scrollTop      = Ember.$(window).scrollTop();
    let containerBottom = $table.height() + $table.offset().top;

    if ($windowScroll < containerBottom ) {
      if ($scrollTop >= offset) {
        this.buildTableWidths();
        this.positionHeaders();
      } else if ($scrollTop <= offset) {
        this.tearDownTableWidths();
        this.removePositions();
      }
    } else {
      if ($floatingHeader.css('position') === 'fixed') {
        this.tearDownTableWidths();
        this.removePositions();
      }
    }
  }
});
