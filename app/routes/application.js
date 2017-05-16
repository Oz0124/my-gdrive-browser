/* global gapi */
/* global MyLib */
import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	beforeModel: function() {
		//console.log("application view finish!");
		Ember.run.schedule('afterRender', this, function() {
			// 檢查使用者是否登入，未登入就打開Login Dialog讓使用者選擇登入哪間公司的雲端硬碟
			var isAuthenticated = this.get('controller.session.isAuthenticated');
			if (!isAuthenticated) {
				$('#login-button').click();
			}
		});
	},
	model: function() {
		return this.store.find('account');
  	},
  	afterModel: function() {
	    if (this.get('session').isAuthenticated) {
            this.authorizeLoad();
        }
	},
	actions: {
	    showModal: function(name, model) {
	      	this.render(name, {
	        	into: 'application',
	        	outlet: 'modal',
	        	model: model
	      	});
	    },
	    removeModal: function() {
	      	this.disconnectOutlet({
	        	outlet: 'modal',
	        	parentView: 'application'
	      	});
	    },
	    googleLogin: function() {
	    	var self = this;
	    	
	    	this.get('session').authenticate('simple-auth-authenticator:torii', 'google-oauth2-bearer')
	    		.then(function(){
                    console.log('token authentication successful!');
                    self.authorizeLoad();
                    
                }, function (error) {
                    console.log('token authentication failed!', error);
                });

	    	return;
        }
	},
	init: function () {
		//console.log("application route finish!");
	},
	// 方法二: 使用setInterval
	authorizeLoad: function () {
		var store = this.store;
		
		// 此寫法是為了解決gapi.auth未載入，就呼叫的問題
		// 原因google api部分function會和<iframe>一起載入，
		// 因此在DOM未完成載入，呼叫這些function會發生undefined
		setTimeout(function () {
			clearInterval(timer);
			if (!gapi || !gapi.auth) {
				console.log("Google API not find!");
			}
				
		}, 1500); // 網頁最佳等待時間為2s以內，因此定義1.5s後，就停止動作並顯示log
		// 每一段時間就檢查google api是否載入?
		var timer = setInterval(function () {
			console.log("check api load");
			if(gapi && gapi.auth) {
				clearInterval(timer);	        
		        // 取得使用者資訊(name, email, 大頭貼)
				MyLib.GDriveBrowser.checkAuth(function (authResult) {
					  			  			
					if (authResult && !authResult.error) {
				       	MyLib.GDriveBrowser.getUserInfo(function (resp) {

							var pictureUrl;
				       		if (resp.result.user.picture && 
								resp.result.user.picture.url) {
								pictureUrl = resp.result.user.picture.url;
							}
							else {
								pictureUrl = ""; 
							}
							
							// 將使用者資料寫入model當中
							store.createRecord('account', {
								id: resp.result.etag,
								name: resp.result.user.displayName,
							  	emailAddress: resp.result.user.emailAddress,
							  	picture: pictureUrl,
							  	isLogin: true,
							  	rootFolderId: resp.result.rootFolderId							  	
							});
							// 將Root folderID寫入files model中
							store.createRecord('files', {
								id: resp.result.rootFolderId, 
								name: "Root Folder",
							  	isRootFolder: true,
							  	fileId: resp.result.rootFolderId
							});
						
							MyLib.GDriveBrowser.loadDriveApi(null);
				       	});   	
				    } else {
				    	console.log('check auth error!');
				    	MyLib.GDriveBrowser.handleAuthClick(function (authResult) {
			  		  			
							if (authResult && !authResult.error) {
					          	MyLib.GDriveBrowser.getUserInfo(function (resp) {

					   				var pictureUrl;
						       		if (resp.result.user.picture && 
										resp.result.user.picture.url) {
										pictureUrl = resp.result.user.picture.url;
									}
									else {
										pictureUrl = ""; 
									}

									// 將使用者資料寫入model當中
									store.createRecord('account', {
										id: resp.result.etag,
										name: resp.result.user.displayName,
									  	emailAddress: resp.result.user.emailAddress,
									  	picture: pictureUrl,
									  	isLogin: true,
									  	rootFolderId: resp.result.rootFolderId
									});
									// 將Root folderID寫入files model中
									store.createRecord('files', {
										id: resp.result.rootFolderId,
										name: "Root Folder",
									  	isRootFolder: true,
									  	fileId: resp.result.rootFolderId
									});
								
									MyLib.GDriveBrowser.loadDriveApi(null);
									
					          	});
					        } else {
					           	console.log("Get user info Error!");
					        }
						});
				    }
				    
				});
	    	}	
		}, 40);
		
	}
});
