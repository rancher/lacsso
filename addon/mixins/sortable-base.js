import Ember from 'ember';

export default Ember.Mixin.create({
  sortableContent: Ember.computed.alias('model'),
  headers: null,
  sortBy: null,
  descending: false,

  actions: {
    changeSort: function(name) {
      if ( this.get('sortBy') === name )
      {
        this.set('descending', !this.get('descending'));
      }
      else
      {
        this.setProperties({
          descending: false,
          sortBy: name
        });
      }
    },

    // Like changeSort, but without the auto-flipping
    setSort: function(name) {
      this.setProperties({
        descending: false,
        sortBy: name
      });
    },
  },

  currentSort: Ember.computed('sortBy','headers.@each.{sortBy}', function() {
    var headers = this.get('headers');
    if ( headers )
    {
      var header = headers.findBy('name', this.get('sortBy'));
      if ( header )
      {
        return header.sort;
      }
    }
  }),

  arranged: Ember.computed('sortableContent.[]','currentSort','descending', function(){
    var content = this.get('sortableContent')||[];
    var currentSort = this.get('currentSort');
    var out;
    if ( currentSort )
    {
      out = content.sortBy.apply(content, currentSort);
    }
    else
    {
      out = content.slice();
    }

    if ( this.get('descending') )
    {
      return out.reverse();
    }
    else
    {
      return out;
    }
  }),
});
