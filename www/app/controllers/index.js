import Controller from '@ember/controller';
import { inject } from '@ember/controller';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Controller.extend({
  applicationController: inject('application'),
  stats: computed.reads('applicationController'),
  config: computed.reads('applicationController.config'),
  settings: computed.reads('applicationController.model.settings'),

  // try to read some settings from the model.settings
  PayoutThreshold: computed('settings', {
    get() {
      var threshold = this.get('settings.PayoutThreshold');
      if (threshold) {
        // in shannon (10**9)
        return threshold / 1000000000;
      }
      return this.get('config').PayoutThreshold;
    }
  }),

  PayoutInterval: computed('settings', {
    get() {
      var interval = this.get('settings.PayoutInterval');
      if (interval) {
        return interval;
      }
      return this.get('config').PayoutInterval;
    }
  }),

  PoolFee: computed('settings', {
    get() {
      var poolfee = this.get('settings.PoolFee');
      if (poolfee) {
        return poolfee + '%';
      }
      return this.get('config').PoolFee;
    }
  }),

  cachedLogin: computed('login', {
    get() {
      return this.get('login') || $.cookie('login');
    },
    set(key, value) {
      $.cookie('login', value);
      this.set('model.login', value);
      return value;
    }
  })
});
