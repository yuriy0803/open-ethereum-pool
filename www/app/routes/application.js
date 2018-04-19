import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import { inject } from '@ember/service';
import { later } from '@ember/runloop';
import $ from 'jquery';
import config from '../config/environment';

function selectLocale(selected) {
  // FIXME
  let supported = ['en', 'ko', 'en-us'];
  const language = navigator.languages[0] || navigator.language || navigator.userLanguage;

  let locale = selected;

  if (locale == null) {
    // default locale
    locale = language;
    if (supported.indexOf(locale) < 0) {
      locale = locale.replace(/\-[a-zA-Z]*$/, '');
    }
  }
  if (supported.indexOf(locale) >= 0) {
    if (locale === 'en') {
      locale = 'en-us';
    }
  } else {
    locale = 'en-us';
  }
  return locale;
}

export default Route.extend({
  intl: inject(),
  selectedLanguage: null,
  poolSettings: null,

  beforeModel() {
    let locale = this.get('selectedLanguage');
    if (!locale) {
      // read cookie
      locale = Ember.$.cookie('lang');
      // pick a locale
      locale = selectLocale(locale);

      this.get('intl').setLocale(locale);
      Ember.$.cookie('lang', locale);
      console.log('INFO: locale selected - ' + locale);
      this.set('selectedLanguage', locale);
    }

    let settings = this.get('poolSettings');
    if (!settings) {
      let self = this;
      let url = config.APP.ApiUrl + 'api/settings';
      Ember.$.ajax({
        url: url,
        type: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function(data) {
          settings = Ember.Object.create(data);
          self.set('poolSettings', settings);
          console.log('INFO: pool settings loaded..');
        },
        error: function(request, status, e) {
          console.log('ERROR: fail to load pool settings: ' + e);
          self.set('poolSettings', {});
        }
      });
    }
  },

  actions: {
    selectLanguage: function(lang) {
      let selected = lang;
      if (typeof selected === 'undefined') {
        return true;
      }
      let locale = selectLocale(selected);
      this.get('intl').setLocale(locale);
      this.set('selectedLanguage', locale);
      Ember.$.cookie('lang', locale);
      Ember.$('#selectedLanguage').html(locale + '<b class="caret"></b>');

      return true;
    }
  },

	model: function() {
    let url = config.APP.ApiUrl + 'api/stats';
    return $.getJSON(url).then(function(data) {
      return EmberObject.create(data);
    });
	},

  setupController: function(controller, model) {
    let settings = this.get('poolSettings');
    model.settings = settings;
    this._super(controller, model);
    later(this, this.refresh, 5000);
  }
});
