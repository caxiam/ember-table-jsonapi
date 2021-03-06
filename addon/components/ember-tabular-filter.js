import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'th',
  action: null,
  headerFilter: '',

  query: null,
  filter: null,

  actions: {
    clearFilter() {
      this.set('headerFilter', '');
    },
    setHeaderFilter(object) {
      if (object) {
        this.set('headerFilter', object.value);
      } else {
        this.set('headerFilter', null);
      }
    },
  },
  setHeaderFilter: Ember.on('init', function () {
    const filter = this.get('filter');
    const property = this.get('property');

    if (filter) {
      for (var i = filter.length - 1; i >= 0; i--) {
        if (filter[i].field === property) {
          this.set('headerFilter', filter[i].value);
        }
      }
    }
    // setup observer after init
    // to avoid multiple requests for properties that are set on init
    this.addObserver('headerFilter', this.filterBy);
  }),
  // observable property is set during init
  filterBy: Ember.observer(function () {
    Ember.run.debounce(this, 'filterName', 750);
  }),
  isClearable: Ember.computed('headerFilter', function () {
    if (this.get('headerFilter')) {
      return true;
    }
    return false;
  }),
  inputPlaceholder: Ember.computed('header.type', function () {
    const type = this.get('header.type');

    if (type === 'date') {
      return 'YYYY-MM-DD';
    }
  }),
  filterName() {
    const query = this.get('query');
    const property = this.get('property');
    const value = this.get('headerFilter');
    let filter;

    // Set the query on the filter object
    if (query && query.hasOwnProperty('filter') && query.filter !== null) {
      filter = this.get('query.filter');
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
