import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    gDriveLogin: function () {
	    	$('.modal').modal('hide');
	    	return this.send('googleLogin');
		}
	}
});
