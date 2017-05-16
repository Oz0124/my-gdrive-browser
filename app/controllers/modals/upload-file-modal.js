import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	$('.modal').modal('hide');
		}
	}
});
