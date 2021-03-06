import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['table-filter'],
  action: null,
  filterProperty: null,
  searchFilter: '',

  query: null,
  filter: null,

  actions: {
    clearFilter() {
      this.set('searchFilter', '');
    },
  },
  filterTable: Ember.observer('searchFilter', function () {
    Ember.run.debounce(this, 'filterName', 750);
  }),
  isClearable: Ember.computed('searchFilter', function () {
    if (this.get('searchFilter')) {
      return true;
    }
    return false;
  }),
  filterName() {
    // Reference parent component query obj
    const query = this.get('query') || this.get('parentView.query');
    const property = this.get('filterProperty');
    const value = this.get('searchFilter');
    let filter;

    // Set the query on the filter object
    if (query && query && query.hasOwnProperty('filter') && query.filter !== null) {
      filter = query.filter;
    } else {
      filter = {};
    }
    filter[property] = value;

    // Remove filter if value is an empty string
    // to prevent empty request from being sent
    if (value === '' || value === null) {
      delete filter[property];
    }

    // Take filter object and break into different format
    // filters = [{field: 'name', value:'foo'}, {field: 'email', value: 'foo@bar.com'}];
    const filters = Object.keys(filter).map(function (key) {
      return {
        field: key,
        value: filter[key],
      };
    });

    // Trigger 'setModel'
    if (!this.isDestroyed || !this.isDestroying) {
      this.set('filter', filters);
    }
  },
});
