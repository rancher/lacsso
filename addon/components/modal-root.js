import Ember from 'ember';
import layout from '../templates/components/modal-root';

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  classNames: ['overlay'],
  classNameBindings: ['modalVisible:modal-open:modal-closed'],
  modalService: Ember.inject.service('modal'),
  modalType: Ember.computed.alias('modalService.modalType'),
  modalVisible: Ember.computed.alias('modalService.modalVisible'),
  closeWithOutsideClick: false,
  click() {
    if (this.get('closeWithOutsideClick') && Ember.$(this.element).hasClass('modal-open')) {
      this.get('modalService').toggleModal();
    }
  }
});
