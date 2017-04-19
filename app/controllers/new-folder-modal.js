/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	var node = this.get('model.node');
	    	// will delete file object
	    	var folderId = this.get('model.node.key');
			var newFolderName = $('#inputName').val();
	    	
	    	// 關閉編輯file name Dialog
			$('.modal').modal('hide');
			// 開啟progress bar
			this.send('showModal', 'progress-bar-modal', null);
			// 呼叫google api 更新
	    	MyLib.GDriveBrowser.insertFileIntoFolder(folderId, newFolderName, function (resp) {
	    		if (resp) {
	    			// 更新檔案成功
	    			node.addNode({
	    				title: resp.title,
	    				key: resp.id,
	    				lazy: true
	    			});
	    		}	
	    		else {
	    			
	    		}
	    		$('.modal').modal('hide');

	    	});
	    	
	    	

	    	
		}
	}
});
