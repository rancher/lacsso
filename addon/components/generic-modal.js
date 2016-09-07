import Ember from 'ember';
import layout from '../templates/components/generic-modal';

export default Ember.Component.extend({
  layout,
  modalService: Ember.inject.service('modal'),
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  actions: {
    close() {
      this.get('modalService').toggleModal();
    }
  }
});
