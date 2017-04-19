import Ember from 'ember';
import $ from 'jquery';

export default Ember.View.extend({
	didInsertElement: function() {
		//console.log("application view finish!");
		Ember.run.schedule('afterRender', this, function() {
			// 檢查使用者是否登入，未登入就打開Login Dialog讓使用者選擇登入哪間公司的雲端硬碟
			var isAuthenticated = this.get('controller.session.isAuthenticated');
			if (!isAuthenticated) {
				$('#login-button').click();
			}
		});
	}
});
