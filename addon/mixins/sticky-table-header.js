import Ember from 'ember';
import ThrottledResize from './throttled-resize';

export default Ember.Mixin.create(ThrottledResize, {
  didInsertElement() {
    let $offset = Ember.$(this.element).find('thead tr').offset().top;

    Ember.$(window).scroll(() => {
      this.updateHeaders($offset);
    });

  },
  willDestroyElement() {
    this._super(...arguments);
    Ember.$(window).unbind('scroll');
  },

  buildTableWidths() {
    let ths = Ember.$(this.element).find('thead tr.fixed-header th');

    Ember.$(this.element).find('thead tr.fixed-header-placeholder th').each((idx, th) => {
      Ember.$(ths[idx]).attr('width', Ember.$(th).outerWidth());
    });
  },

  tearDownTableWidths() {
    Ember.$(this.element).find('thead tr.fixed-header th').each((idx, td) => {
      Ember.$(td).removeAttr('width');
    });
  },

  onResize() {
    this.buildTableWidths();
  },

  updateHeaders(offset) {
    let $windowScroll = Ember.$(window).scrollTop();
    let $table = Ember.$(this.element);
    let $floatingHeader = $table.find('thead tr.fixed-header');
    let $scrollTop = Ember.$(window).scrollTop();
    let containerBottom = $table.height() + $table.offset().top;

    if ($windowScroll < containerBottom ) {
      if ($scrollTop >= offset) {
        this.buildTableWidths();
        $floatingHeader.css({
          'position': 'fixed',
          'top':0
        });
      } else if ($scrollTop <= offset) {
        this.tearDownTableWidths();
        $floatingHeader.css({
          'position': '',
          'top': '',
        });
      }
    } else {
      if ($floatingHeader.css('position') === 'fixed') {
        this.tearDownTableWidths();
        $floatingHeader.css({
          'position': '',
          'top': '',
        });
      }
    }
  }
});
