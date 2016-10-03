import Ember from 'ember';

export default Ember.Service.extend({
  modalType: 'generic-modal',
  modalOpts: null,
  modalVisible: false,
  closeWithOutsideClick: Ember.computed.alias('modalOpts.closeWithOutsideClick'),
  toggleModal: function(type=null, opts=null) {
    if (opts) {
      this.set('modalOpts', opts);
    }
    this.set('modalType', type);
    this.toggleProperty('modalVisible');
    if (!this.get('modalVisible') && this.get('modalOpts')) {
      this.set('modalOpts', null);
    }
  },
});
