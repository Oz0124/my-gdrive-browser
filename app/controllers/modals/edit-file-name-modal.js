/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	actions: {
	    ok: function () {
	    	var fileItem = this.get('model');
	    	var newFileName = $('#inputName').val();
	    	var newFileMetadata = {
	    		mimimeType: fileItem.mimeType,
	    		title: newFileName
	    	};
	    	// 關閉編輯file name Dialog
			$('.modal').modal('hide');
			// 開啟progress bar
			this.send('showModal', 'modals/progress-bar-modal', null);
			// 呼叫google api 更新
	    	MyLib.GDriveBrowser.updateFileMetadata(fileItem.id, newFileMetadata, function (resp) {
	    		if (resp) {
	    			// 更新檔案成功
	    			Ember.set(fileItem, 'title', resp.title);
	    		}	
	    		else {
	    			
	    		}
	    		$('.modal').modal('hide');

	    	});
	    	
	    	

	    	
		}
	}
});
