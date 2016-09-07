import Ember from 'ember';

export default Ember.Service.extend({
  modalType: 'generic-modal',
  modalVisible: false,
  toggleModal: function(type=null) {
    this.set('modalType', type);
    this.toggleProperty('modalVisible');
  },
});
