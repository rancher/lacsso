import Ember from 'ember';
import layout from '../templates/components/generic-modal';
import ModalBase from './modal-base';

export default ModalBase.extend({
  layout,
  willRender() {
    this.set('modalService.modalOpts.modalClasses', ['span-4', 'offset-4']);
  }
});
