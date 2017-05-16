/* global MyLib */
import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
	rootFolder: function () {
		var item = null;

		this.store.filter('files', {isRootFolder: true}, function (file) {
		  	item = {
		  		key: file.get('fileId'),
				title: file.get('name')
		  	};
		});
		return item;
	}.property('model'),
	// 目前目錄下的file list
	files: [],
	//fancytree options
	treeOptions: {},
	//fancytree methods
	treeCustomMethods: {},
	actions: {
		// 載入與我分享file List
		loadShareWithMeFolders: function () {
			
			// 先把tree的activat node取消
			var treeCustomMethods = this.get('treeCustomMethods');
			var activateNode = treeCustomMethods.getActiveNode();
			if (activateNode) {
				treeCustomMethods.deactivateNodeByKey(activateNode.key);
			}
			// 載入與我共享的file list
			this.loadShareWithMeFolders();
		},
		// 載入丟入垃圾桶的file list
		loadTrashFolders: function () {
			// 先把tree的activat node取消
			var treeCustomMethods = this.get('treeCustomMethods');
			var activateNode = treeCustomMethods.getActiveNode();
			if (activateNode) {
				treeCustomMethods.deactivateNodeByKey(activateNode.key);
			}
			// 載入垃圾桶的file list
			this.loadTrashedFiles();
		},
		// 顯示確認將檔案丟入垃圾桶Dialog
		showTrashFileDialog: function (fileItem) {
			var files = this.get('files');

			var viewModel = {
				files: files,
				fileItem: fileItem
			};

			this.send('showModal', 'modals/trash-file-modal', viewModel);
		},
		// 顯示編輯file name Dialog
		showEditFileNameDialog: function (fileItem) {

			this.send('showModal', 'modals/edit-file-name-modal', fileItem);
		},
		// 顯示上傳檔案Dialog
		showInsertFileDialog: function () {
			var files = this.get("files");
			var treeMethods = this.get('treeCustomMethods');
			var activeNode = treeMethods.getActiveNode();
            var folderId = "";
            if (activeNode) {
                folderId = activeNode.key;
            } 
            else {
                folderId = treeMethods.getRootNode().key;
                
            }

            var viewModel = {
				files: files,
				folderId: folderId,
				treeMethods: treeMethods
			};

			this.send('showModal','modals/upload-file-modal',viewModel);
		},
		// 顯示確認刪除檔案Dialog
		showDeleteFileDialog: function (fileItem) {
			
			var files = this.get('files');
			var viewModel = {
				files: files,
				fileItem: fileItem
			};

			this.send('showModal', 'modals/delete-file-modal', viewModel);
		},
		// 復原檔案
		recoveryFile: function (fileItem) {
			var files = this.get('files');
			var self = this;

			this.showProgressBar();
			// 呼叫google api 復原
			MyLib.GDriveBrowser.restoreFile(fileItem.id, function (resp) {
				if (resp) {
					var treeMethods = self.get('treeCustomMethods');
					var parents = treeMethods.getNodeByKey(resp.parents[0].id);
					parents.addNode({
						key: resp.id,
						title: resp.title,
						lazy: true
					});
		
					files.removeObject(fileItem);
					self.closeProgressBar();
				}
			});
		},
		showProgressBar: function () {
			this.showProgressBar();
		},
		closeProgressBar: function () {
			this.closeProgressBar();
		}
	},
	init: function () {
		var self = this;

		//設定tree元件 options
		var treeOptions = {
			checkBox: false,
			callback: {
				renderNode: function (event, data) {
					
					// 載入的node不再重新render
					if (data.node.isLoaded()) {
                    	return false;
                	}
                	
                	if ($(data.node.span).find('.fancytree-options').length > 0) {
                    	return false;
                	}

                	var node = data.node;
					var options = $('<div class="fancytree-options"></div>');

					// add empty folder
				    var addButton = $('<i class="glyphicon glyphicon-plus fancytree-funct-icon" role="button"></i>');
				    options.append(addButton);
				    $(addButton).click(function (event) {
				       	event.stopPropagation();
				       	var viewModel = {
				       		node: node
				       	};
				        self.send('showModal', 'modals/new-folder-modal', viewModel);
				    });
                	
                	if (!data.node.getParent().isRootNode()) {
				       	// edit folder name
				       	var editButton = $('<i class="glyphicon glyphicon-pencil fancytree-funct-icon" role="button"></i>');
				       	options.append(editButton);
				       	$(editButton).click(function (event) {
				       		event.stopPropagation();
				       		var viewModel = {
				       			node: node
				       		};
				       		self.send('showModal', 'modals/edit-folder-name-modal', viewModel);
				        });

				       	// delete folder
				       	var trashButton = $('<i class="glyphicon glyphicon-trash fancytree-funct-icon" role="button"></i>');
				       	options.append(trashButton);
				       	$(trashButton).click(function (event) {
				       		event.stopPropagation();
				       		var viewModel = {
				       			node: node
				       		};
				       		self.send('showModal', 'modals/trash-folder-modal', viewModel);
				        });
                	}
										
			       	// updata folder
			       	var updataButton = $('<i class="glyphicon glyphicon-refresh fancytree-funct-icon" role="button"></i>');
			       	options.append(updataButton);
			        $(updataButton).click(function (event) {
			       		event.stopPropagation();
			        	
			        	// show progress bar
						self.showProgressBar();
						node.setStatus("loading");
						// 呼叫google api load file and folder list
		                MyLib.GDriveBrowser.loadSubFolders(data.node.key, function (result_list) {
							if (result_list && result_list.items) {
								
								data.node.removeChildren();
					            result_list.items.forEach(function (o) {
					            	// handle folder
					              	var item = null;
					                					            
				                    if (o.mimeType === "application/vnd.google-apps.folder") {
				                    	// handle folder
				                    	item = {
						                   	key: o.id,
										  	title: o.title,
										  	children: [],
										  	lazy: true
						                };
				                        data.node.addNode(item);
				                    }
				                });   
				                node.setStatus("ok");
							}
							data.node.setExpanded(true);
							// 為了能重新整理File List
							if (data.node.isActive()) {
								data.node.setActive(false);
							}
							data.node.setActive(true);
						});
			        });

					$(node.span).append(options);
					options.hide();
			       	$(node.span).hover(function () {
			          	// mouse over
			          	options.show();
			       	}, function () {
			           // mouse out
			           options.hide();
			       	});
				},
				activate: function(event, data) { 
					
					var files = self.get("files");
					// show progress bar
					self.showProgressBar();
					files.clear();
					// 呼叫google api load file and folder list
	                MyLib.GDriveBrowser.loadSubFolders(data.node.key, function (result_list) {
						if (result_list && result_list.items) {
							
							result_list.items.forEach(function (o) {
				            	// handle folder
				              	var item = null;
				                					            
			                    if (o.mimeType === "application/vnd.google-apps.folder") {
			                    	// handle folder
			                    	item = {
					                   	key: o.id,
									  	title: o.title,
									  	children: [],
									  	lazy: true
					                };
			                        
			                    } else {
			                    	// handle file
			                    	item = self.fileInfo2ViewModel(o);
			                    	files.pushObject(item);
			                    }
			                });   
						}
						
						// close progress bar
						self.closeProgressBar();
					});
			    },
				lazyLoad: function (event, data) {
					// 重要
					// http://emberjs.com/api/classes/RSVP.Promise.html
					data.result = new Ember.RSVP.Promise(function (resolve, reject) {
				      
				      var respFunction = Ember.run.bind(null, resolve);
				      // 呼叫google api load folder list
				      MyLib.GDriveBrowser.loadSubFolders(data.node.key, respFunction);

				    }).then(function (result_list) {
				     	
				     	var folders = [];

				    	if (result_list && result_list.items) {
							result_list.items.forEach(function (o) {
				               	var item = null;

					            if (o.mimeType === "application/vnd.google-apps.folder") {
					            	item = {
					                  	key: o.id,
									  	title: o.title,
									  	children: [],
									  	lazy: true
					                };

					                folders.pushObject(item);
					            }
					        }); 

						}

				      	return folders;
				    });
				}
        	}
						
		};

		this.set('treeOptions', treeOptions);
	},
	loadShareWithMeFolders: function () {
		var self = this;
		var files = this.get('files');
		// show progress bar
		this.showProgressBar();

		files.clear();
		// 呼叫google api load share with me file list
		// 由於callback中有使用到loadShareWithMeFolders的this，因此無法將當中程式區塊獨立成一個
		// function和loadTrashedFiles共用
		MyLib.GDriveBrowser.loadShareWithMeFolders(function (result_list) {
			
			if (result_list && result_list.items) {
	        	result_list.items.forEach(function (o) {
	                	
		           	var item = self.fileInfo2ViewModel(o);
		                	
		            if (o.mimeType !== "application/vnd.google-apps.folder") {
		               	files.pushObject(item);
		            }
		        });				                
   			}
        	// close progress bar
			self.closeProgressBar();
        	
        });
	},
	loadTrashedFiles: function () {
		var self = this;
		var files = this.get('files');
		// show progress bar
		this.showProgressBar();

		files.clear();
		// 呼叫load trashed file list
		MyLib.GDriveBrowser.loadTrashedFiles(function (result_list) {
						
			if (result_list && result_list.items) {
	        	result_list.items.forEach(function (o) {
	                var item = self.fileInfo2ViewModel(o);
		                	
		            files.pushObject(item);
		        });				                
   			}
        	// close progress bar
			self.closeProgressBar();
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
		timeString = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + "";
		  			
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
	},
	showProgressBar: function () {
		if ($('.modal').length === 0) {
			this.send('showModal', 'modals/progress-bar-modal', null);
		}

	},
	closeProgressBar: function () {
		if ($('.modal').length > 0) {
			$('.modal').modal('hide');
		}
	}
});
