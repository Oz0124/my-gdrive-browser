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
	    	// 先關閉確認將檔案丟垃圾桶Dialog	 
	    	$('.modal').modal('hide');
	    	// 開啟progress bar
	    	this.send('showModal', 'progress-bar-modal', null);
	    	// 呼叫Google Api 丟垃圾桶
	    	MyLib.GDriveBrowser.trashFile(fileItem.id, function (resp) {
	    		if (resp.result) {
	    			// 丟垃圾桶成功
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
