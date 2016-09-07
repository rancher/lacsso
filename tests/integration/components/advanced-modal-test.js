import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('advanced-modal', 'Integration | Component | advanced modal', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{advanced-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#advanced-modal}}
      template block text
    {{/advanced-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
