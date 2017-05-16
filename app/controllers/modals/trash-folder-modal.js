/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	
	    	var node = this.get('model.node');
	    	// will delete file object
	    	var folderId = this.get('model.node.key');
	    	// 先關閉確認將資料夾丟垃圾桶Dialog	 
	    	$('.modal').modal('hide');
	    	// 開啟progress bar
	    	this.send('showModal', 'modals/progress-bar-modal', null);
	    	// 呼叫Google Api 丟垃圾桶
	    	MyLib.GDriveBrowser.trashFile(folderId, function (resp) {
	    		if (resp.result) {
	    			// 丟垃圾桶成功
	    			node.remove();
	    		}	
	    		else {
	    			
	    		}
	    		// 關閉progress bar
	    		$('.modal').modal('hide');
	    	});

		}
	}
});


