import Ember from 'ember';
import $ from 'jquery';

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
		var self = this;
		// Dialog設定參數: 點擊Dialog以外區域，不會使Dialog close
		var backdrop = this.get('backdrop');

	    this.$('.modal').modal({backdrop: backdrop}).on('hidden.bs.modal', function() {
	      	this.sendAction('close');
	    }.bind(this));

	    // 可以自己控制modal關閉時機
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.set('hideModelMethod', function () {
                self.$('.modal').modal('hide');
            });
        });

	}.on('didInsertElement')
});
