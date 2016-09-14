import Ember from 'ember';

export default Ember.Mixin.create({
  didInsertElement() {
    let $table = Ember.$(this.element);
    let $tableHeaderClone = $table.find('thead tr').clone().addClass('fixed-header');
    let $offset = $tableHeaderClone.offset().top;

    //this.buildFloatingHeader($table, $tableHeaderClone);
    //$table.find('thead').prepend($tableHeaderClone);
    Ember.$(window).scroll(() => {
      this.updateHeaders($tableHeaderClone, $offset);
    });
  },
  buildFloatingHeader(table, tableHeaderClone) {
    let widths = [];
    let clonedThs = tableHeaderClone.find('th');
    table.find('thead tr th').each((idx, th) => {
      Ember.$(clonedThs[idx]).attr('width', Ember.$(th).outerWidth());
    });
    table.find('thead').append(tableHeaderClone);
  },
  updateHeaders(tableHeader, offset) {
    let $tableWidth = Ember.$(this.element).width();
    let $scrollTop = Ember.$(window).scrollTop();
    if ($scrollTop >= offset) {
      Ember.$(this.element).find('thead tr:nth-child(2)').css({
            "position": "absolute",
            "top":0
           });
      //$(tableHeader).css('width', $tableWidth).insertBefore(Ember.$(this.element));
      //tableHeader.css({
            //"visibility": "visible",
            //"width": $tableWidth
           //});
    } else if ($scrollTop <= offset) {
      //tableHeader.css({
            //"visibility": "hidden",
            //"width": $tableWidth
           //});
    }
  }
});
