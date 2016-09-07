import Ember from 'ember';
import layout from '../templates/components/modal-root';

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  classNames: ['overlay'],
  classNameBindings: ['modalVisible::hide'],
  modalService: Ember.inject.service('modal'),
  modalType: Ember.computed.alias('modalService.modalType'),
  modalVisible: Ember.computed.alias('modalService.modalVisible'),
});
