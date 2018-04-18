import Controller from '@ember/controller';
import { inject } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  applicationController: inject('application'),
  stats: computed.reads('applicationController.model.stats'),
  config: computed.reads('applicationController.config'),
  hashrate: computed.reads('applicationController.hashrate'),

  roundPercent: computed('stats', 'model', {
    get() {
      let percent = this.get('model.roundShares') / this.get('stats.roundShares');
      if (!percent) {
        return 0;
      }
      return percent;
    }
  }),

  netHashrate: computed({
    get() {
      return this.get('hashrate');
    }
  }),

  earnPerDay: computed('model', {
    get() {
      return 24 * 60 * 60 / this.get('config').BlockTime * this.get('config').BlockReward *
        this.getWithDefault('model.hashrate') / this.get('hashrate');
    }
  })
});
