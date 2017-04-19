/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
	addFileMode: true,
	actions: {
		click: function () {
			$('#upload-file').click();
		}
	},
	didInsertElement: function() { 
		var self = this;
		var files = this.get('model.files');
        var folderId = this.get('model.folderId');
        var treeMethods = this.get('model.treeMethods');
       
        // 上傳檔案
		$('#upload-file')
			.fileupload({
        		singleFileUploads: false
        		//limitMultiFileUploads: 5
    		})
    		.bind('fileuploadadd', function (e, data) {
    			data.submit();
    		})
    		.bind('fileuploadsubmit', function (e, data) {
    			self.set('addFileMode', false);
                
                var successArray = [];
                
                // http://stackoverflow.com/questions/20100245/how-can-i-execute-array-of-promises-in-sequential-order
                var result = data.files.reduce(function (cur, next) {
                    return cur.then(function () {
                        return new Ember.RSVP.Promise(function (resolve, reject) {
                      
                          var respFunction = Ember.run.bind(null, resolve);
                          // 呼叫google api load folder list
                          MyLib.GDriveBrowser.insertFile(folderId, next, respFunction);

                        }).then(function (resp) {
                            if (resp) {
                                var item = self.fileInfo2ViewModel(resp);
                                files.pushObject(item);
                                successArray.pushObject(item);
                            }
                            return false;
                        });                      
                    });
                }, Ember.RSVP.resolve()).then(function (result) {
                    //all executed
                    console.log(successArray);
                    console.log(result);

                    //self.set('addFileMode', true);
                    $('.modal').modal('hide');
                    treeMethods.activateNodeByKey(folderId);
                });
                
                
                

    			
    		});		
	},
    // 轉換viewModel
    fileInfo2ViewModel: function (file) {
        var item = null;
        var timeString = "";
        var fileSizeString = "";
        var date = new Date(file.modifiedDate);
        var isExpanded = false;

        fileSizeString = this.generateFileSizeString(file.fileSize);
        
        // 產生最後修改日期字串
        timeString = date.getUTCFullYear() + "年" + (date.getUTCMonth() + 1) + "月" + date.getUTCDate() + "日";
                    
        item = {
            fileSizeString: fileSizeString,
            id: file.id,
            mimeType: file.mimeType,
            iconLink: file.iconLink,
            title: file.title,
            ownerNames: file.ownerNames,
            lastModifyingUserName: file.lastModifyingUserName,
            modifiedDate: file.modifiedDate,
            modifiedDateString: timeString,
            fileSize: file.fileSize,
            fileExtension: file.fileExtension,
            webContentLink: file.webContentLink,
            explicitlyTrashed: file.explicitlyTrashed,
            alternateLink: file.alternateLink,
            isExpanded: isExpanded,
            sharedWithMeDate: file.sharedWithMeDate
        };

        return item;

    },
    // 產生file size顯示字串
    generateFileSizeString: function (fileSize) {
        var fileSizeString = "";

        // 產生檔案大小的字串
        if (fileSize > (1024*1024*1024)) {
            fileSizeString = parseInt(fileSize/(1024*1024*1024)) + "GB";
        }
        else if (fileSize > (1024*1024)) {
            fileSizeString = parseInt(fileSize/(1024*1024)) + "MB";
        }
        else if (fileSize > (1024)){
            fileSizeString = parseInt(fileSize/(1024)) + "KB";
        } 
        else {
            if (fileSize) {
                fileSizeString = fileSize + "B";
            }
        }

        return fileSizeString;
    }    
});
