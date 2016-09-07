import Ember from 'ember';

export default Ember.Component.extend({
  modalService: Ember.inject.service('modal'),
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  actions: {
    close() {
      this.get('modalService').toggleModal();
    },
  }
});
