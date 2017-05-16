/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	var node = this.get('model.node');
	    	var folderId = this.get('model.node.key');
	    	var newFolderName = $('#inputName').val();
	    	var newFolderMetadata = {
	    		mimimeType: "application/vnd.google-apps.folder",
	    		title: newFolderName
	    	};
	    	// 關閉編輯file name Dialog
			$('.modal').modal('hide');
			// 開啟progress bar
			this.send('showModal', 'modals/progress-bar-modal', null);
			// 呼叫google api 更新
	    	MyLib.GDriveBrowser.updateFileMetadata(folderId, newFolderMetadata, function (resp) {
	    		if (resp) {
	    			// 更新檔案成功
	    			node.setTitle(resp.title);
	    		}	
	    		else {
	    			
	    		}
	    		$('.modal').modal('hide');

	    	});	    	
		}
	}
});
