import Ember from 'ember';

export default Ember.Controller.extend({
  modalService: Ember.inject.service('modal'),
  actions: {
    openModal: function(type) {
      let modalService = this.get('modalService');
      modalService.set('modalOpts.modalContent', 'this is a test modal');
      modalService.toggleModal(type);
    }
  }
});
