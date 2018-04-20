import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import { later } from '@ember/runloop';
import $ from 'jquery';
import config from '../config/environment';

export default Route.extend({
  minerCharts: null,
  paymentCharts: null,

	model: function(params) {
		var url = config.APP.ApiUrl + 'api/accounts/' + params.login;
    let charts = this.get('minerCharts');
    if (!charts) {
      url += '/chart';
    }
    let self = this;
    return $.getJSON(url).then(function(data) {
      if (!charts) {
        self.set('minerCharts', data.minerCharts);
        self.set('paymentCharts', data.paymentCharts);
      } else {
        data.minerCharts = self.get('minerCharts');
        data.paymentCharts = self.get('paymentCharts');
      }
      data.login = params.login;
      return EmberObject.create(data);
    });
	},

  setupController: function(controller, model) {
    this._super(controller, model);
    later(this, this.refresh, 5000);
  },

  actions: {
    error(error) {
      if (error.status === 404) {
        return this.transitionTo('not-found');
      }
    }
  }
});
