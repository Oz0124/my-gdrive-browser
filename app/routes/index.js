import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		// 第一筆資料為root folder
		return this.store.find('files');
  	}
});
