import Ember from 'ember';

export default Ember.Component.extend({
	closeText: 'Close',
	okText: 'Ok',
	actions: {
	    ok: function() {
	      	this.$('.modal').modal('hide');
	      	this.sendAction('ok');
	    }
	},
	show: function() {
		// Dialog設定參數: 點擊Dialog以外區域，不會使Dialog close
		var backdrop = this.get('backdrop');

	    this.$('.modal').modal({backdrop: backdrop}).on('hidden.bs.modal', function() {
	      	this.sendAction('close');
	    }.bind(this));
	}.on('didInsertElement')
});
