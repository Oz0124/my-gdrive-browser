/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	// files array
	    	var files = this.get('model.files');
	    	// will delete file object
	    	var fileItem = this.get('model.fileItem');
	    	
	    	// 先關閉確認刪除Dialog	    	
			$('.modal').modal('hide');
			// 開啟progress bar
			this.send('showModal', 'progress-bar-modal', null);
			// 呼叫Google Api 刪除
	    	MyLib.GDriveBrowser.deleteFile(fileItem.id, function (resp) {
	    		if (resp.result) {
	    			// 刪除成功
	    			files.removeObject(fileItem);
	    		}	
	    		else {
	    			
	    		}
	    		// 關閉progress bar
	    		$('.modal').modal('hide');

	    	});
	    	
	    	

	    	
		}
	}
});
