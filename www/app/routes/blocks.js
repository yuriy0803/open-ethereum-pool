import Route from '@ember/routing/route';
import $ from 'jquery';
import Block from "../models/block";
import config from '../config/environment';

export default Route.extend({
  candidates: null,
  immature: null,
  matured: null,
  luckCharts: null,
  candidatesTotal: null,
  immatureTotal: null,
  maturedTotal: null,
  timestamp: null,

  model: function() {
    let url = config.APP.ApiUrl + 'api/blocks';
    let self = this;
    return $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      beforeSend: function(r) {
        let lastmod = self.getWithDefault("timestamp", 0);
        if (lastmod) {
          r.setRequestHeader('If-Modified-Since', new Date(lastmod).toGMTString());
          r.setRequestHeader('If-None-Match', '"OEP/'
            + self.getWithDefault('maturedTotal', 0) + '/'
            + self.getWithDefault('immatureTotal', 0) + '/'
            + self.getWithDefault('candidatesTotal', 0) + '"');
        }
      }
    }).then(function(data) {
      let now = new Date().getTime();

      if (data.candidates) {
        data.candidates = data.candidates.map(function(b) {
          return Block.create(b);
        });
        self.set('candidates', data.candidates);
        self.set('candidatesTotal', data.candidatesTotal);
        self.set('timestamp', now);
      } else if (data.candidatesTotal > 0) {
        data.candidates = self.get('candidates');
      } else {
        self.set('candidates', null);
        self.set('candidatesTotal', 0);
      }

      if (data.immature) {
        data.immature = data.immature.map(function(b) {
          return Block.create(b);
        });
        self.set('immature', data.immature);
        self.set('immatureTotal', data.immatureTotal);
        self.set('timestamp', now);
      } else if (data.immatureTotal > 0) {
        data.immature = self.get('immature');
      } else {
        self.set('immature', null);
        self.set('immatureTotal', 0);
      }

      if (data.matured) {
        data.matured = data.matured.map(function(b) {
          return Block.create(b);
        });
        self.set('matured', data.matured);
        self.set('maturedTotal', data.maturedTotal);
        self.set('timestamp', now);
      } else if (data.maturedTotal > 0) {
        data.matured = self.get('matured');
      }

      // luckCharts
      if (data.luckCharts) {
        self.set('luckCharts', data.luckCharts);
        self.set('timestamp', now);
      } else {
        data.luckCharts = self.get('luckCharts');
      }

      return data;
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
  }
});
