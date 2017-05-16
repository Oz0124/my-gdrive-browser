import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
	tagName: 'button',
  	classNames: 'btn btn-default',
  	click: function () {
  		this.sendAction('gDriveLogin');
  	}
});
