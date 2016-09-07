import Ember from 'ember';

export default Ember.Controller.extend({
  modalService: Ember.inject.service('modal'),
  actions: {
    openModal: function(type) {
      let modalService = this.get('modalService');
      modalService.set('modalOpts.modalContent', 'this is a test modal');
      if (type === 'generic-modal') {
        modalService.set('modalOpts.modalClasses', ['span3', 'offset-7']);
      } else {
        modalService.set('modalOpts.modalGoAction', 'testAction');
      }
      modalService.toggleModal(type);
    },
    testAction: function() {
      debugger;
      alert('Wow Much Work')
    }
  }
});
