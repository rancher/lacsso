import Ember from 'ember';

const DEFAULTOPTS = {
  modalCancelButton: 'Cancel',
  modalClasses: ['span-6', 'offset-3'],
  modalContent: null,
  modalGoButton: 'Okay',
  modalHeader: 'Default: Alert of Modal header',
  modalGoAction: null,
};

export default Ember.Service.extend({
  modalType: 'generic-modal',
  modalVisible: false,
  modalOpts: {},
  init() {
    this._super(...arguments);
    this.setDefaults();
  },
  setDefaults() {
    let opts = {};
    Object.assign(opts, DEFAULTOPTS);
    this.set('modalOpts', opts);
  },
  toggleModal: function(type=null) {
    if (this.get('modalVisible')) {
      this.setDefaults();
    }
    this.set('modalType', type);
    this.toggleProperty('modalVisible');
  },
});
