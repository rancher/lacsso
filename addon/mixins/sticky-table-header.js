import Ember from 'ember';
import ThrottledResize from './throttled-resize';

export default Ember.Mixin.create(ThrottledResize, {
  didInsertElement() {
    let $offset = Ember.$(this.element).find('thead tr:nth-child(2)').offset().top;

    this.buildFloatingHeader();
    Ember.$(window).scroll(() => {
      this.updateHeaders($offset);
    });
  },
  buildFloatingHeader() {
    Ember.$(this.element).find('thead tr th').each((idx, th) => {
      Ember.$(th).attr('width', Ember.$(th).outerWidth());
    });
  },
  onResize() {
    this.buildFloatingHeader();
  },
  updateHeaders(offset) {
    let $windowScroll = Ember.$(window).scrollTop();
    let $table = Ember.$(this.element);
    let $floatingHeader = $table.find('thead tr:nth-child(2)');
    let $scrollTop = Ember.$(window).scrollTop();
    let containerBottom = $table.height() + $table.offset().top;

    if ($windowScroll < containerBottom ) {
      if ($scrollTop >= offset) {
        $floatingHeader.css({
          'position': 'fixed',
          'top':0
        });
      } else if ($scrollTop <= offset) {
        $floatingHeader.css({
          'position': '',
          'top': '',
        });
      }
    } else {
      if ($floatingHeader.css('position') === 'fixed') {
        $floatingHeader.css({
          'position': '',
          'top': '',
        });
      }
    }
  }
});
