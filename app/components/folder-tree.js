/* global MyLib */
import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
	resizeEventId: function() {
        let elementId = this.get('elementId');

        return "resize." + elementId;
    }.property('elementId'),

    init: function() {
        this._super();
        
        Ember.run.scheduleOnce('afterRender', this, function() {
            let self = this;
            let resizeEventId = this.get('resizeEventId');

            this.updateLayout();

            $(window).bind(resizeEventId, function() {
                self.updateLayout();
            });
        });
    },

    updateLayout: function() {
    	var containerHeight = $(window).height();       
        
        this.$().height(containerHeight - 260);
    },

    willDestroyElement: function() {
        let resizeEventId = this.get('resizeEventId');
        $(window).unbind(resizeEventId);
    },

	_initializeFancytree: function() {

		var self = this;
		var model = [];
		
		var treeOptions = this.get('treeOptions');
								
		// 設定tree selector
		var treeSelectorString = this.elementId;
		var treeSelector = "#" + treeSelectorString;
				
		this.sendAction('showProgressBar');
		
		// 初始化，先去取得根目錄與第一層子目錄
		MyLib.GDriveBrowser.getRootFolderId(function (resp) {

			model.pushObject({
				key: resp.rootFolderId,
				title: "Root Folder",
				lazy: true,
				children: []

			});
			
			self.reload();
		});
		
		//this.$(".container").append("<div id=" + treeSelectorString + "></div>");
		// http://mavilein.github.io/javascript/2013/08/01/Ember-JS-After-Render-Event/
		Ember.run.scheduleOnce('afterRender', this, function () {

			
			// 先產生一個無資料的fancytree
	    	// perform your jQuery logic here
			// fancytree參數設定
			Ember.$(treeSelector).fancytree({
				extensions: (typeof (treeOptions.extensions) !== 'undefined') ? treeOptions.extensions : [],
				keyboard: false, 
				autoCollapse: (typeof (treeOptions.autoCollapse) !== 'undefined') ? treeOptions.autoCollapse : false,
				selectMode: (typeof (treeOptions.selectMode) !== 'undefined') ? treeOptions.selectMode : 1,
			    checkbox: (typeof (treeOptions.checkBox) !== 'undefined') ? treeOptions.checkBox : false,
			    icons: (typeof (treeOptions.icons) !== 'undefined') ? treeOptions.icons : false,
			    //source:  (typeof (treeOptions.source) !== 'undefined') ? treeOptions.source : [],
			    source: model,
			    // 右鍵選單
			    /*
			    contextMenu: {
			        menu: (typeof (treeOptions.contextMenu.menu) !== 'undefined') ? treeOptions.contextMenu.menu : {},
			        actions: function(node, action, options) {
			        	if (treeOptions &&
			        		treeOptions.contextMenu &&
		                    treeOptions.contextMenu.callback &&
		                    typeof treeOptions.contextMenu.callback.actions === 'function') {

		                    return treeOptions.contextMenu.callback.actions(node, action, options);

		                }
			        }
			    },
			    */
				// --- Node events -------------------------------------------------
				//待測試
				
				//callback
				renderNode: function (event, data) {
					if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.renderNode === 'function') {

	                    return treeOptions.callback.renderNode(event, data);

	                }
				},
	            click: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.click === 'function') {

	                    return treeOptions.callback.click(event, data);

	                }

	            },
	            /*
	            keydown: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.keydown === 'function') {

	                    return treeOptions.callback.keydown(event, data);

	                }

	            },
	            keypress: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.keypress === 'function') {

	                    return treeOptions.callback.keypress(event, data);

	                }

	            },
	            blur: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.blur === 'function') {

	                    treeOptions.callback.blur(event, data);

	                }

	            },
	            expand: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.expand === 'function') {

	                    treeOptions.callback.expand(event, data);

	                }

	            },
	            create: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.create === 'function') {

	                    treeOptions.callback.create(event, data);

	                }

	            },
	            postProcess: function (data, dataType) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.postProcess === 'function') {

	                    treeOptions.callback.postProcess(data, dataType);

	                }

	            },
				*/
				activate: function(event, data) {  
			    	
	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.activate === 'function') {

	                    treeOptions.callback.activate(event, data);

	                }	

			    },
			    deactivate: function(event, data) {
			      	if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.deactivate === 'function') {

	                    treeOptions.callback.deactivate(data);

	                }    
			    },
			    focus: function(event, data) {
			      	if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.focus === 'function') {

	                    treeOptions.callback.focus(data);

	                }    
			    },
			    lazyLoad: function(event, data) {

			      	if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.lazyLoad === 'function') {
			      		
			      		treeOptions.callback.lazyLoad(event, data);

	                } 
			    },
			    select: function(event, data) {
					if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.select === 'function') {

	                    treeOptions.callback.select(event, data);

	                }  
			    },
			    dblclick: function (event, data) {

	                if (treeOptions &&
	                    treeOptions.callback &&
	                    typeof treeOptions.callback.dblclick === 'function') {

	                    return treeOptions.callback.dblclick(event, data);

	                }
	                
	            }
	    
			});

		    //以指定的key值來選中某個項目
		    this.activateNodeByKey = function (key) {
		    	var tree = Ember.$(treeSelector).fancytree("getTree");
		        if (tree) {
		            if(self.getNodeByKey(key) !== null){
		            	tree.activateKey(key);
		            }
		        }
		    };
		    //以指定的key值來取消選中某個項目
		    this.deactivateNodeByKey = function (key) {
		        var node = Ember.$(treeSelector).fancytree("getTree").getNodeByKey(key);
		        if (node) {
		            //node.deactivate();
		            node.setActive(false);
		        }
		    };

		    //以指定的key值來取得樹節點
		    this.getNodeByKey = function (key) {
		        var tree = Ember.$(treeSelector).fancytree("getTree");
		        if (tree) {
		            return tree.getNodeByKey(key);
		        } else {
		            return null;
		        }

		    };
		    
		    //以指定的key值來取得該項目的父節點
		    this.getParent = function (key) {
		    	var node = Ember.$(treeSelector).fancytree("getTree").getNodeByKey(key);

		        if (node) {
		            return node.getParent();
		        } else {
		            return null;
		        }
		    };
			
			
		    //取得被選取的節點
		    //回傳被選取的節點的Array, 如果沒有選取則是空Array
		    this.getSelectedNodes = function () {

		        var tree = Ember.$(treeSelector).fancytree("getTree");

		        if (tree) {
		            return tree.getSelectedNodes(false);
		        }

		    };

		    //以指定的key值來選中某個項目
		    this.expandNodeByKey = function (key) {
		    	var tree = Ember.$(treeSelector).fancytree("getTree");
		        if (tree) {
		            if(self.getNodeByKey(key) !== null){
		            	tree.activateKey(key).setExpanded(true);
		            }
		        }
		    };

		    //重載整棵樹
		    this.reload = function (key) {

		        var tree = Ember.$(treeSelector).fancytree("getTree");
		        var model = self.get('model');
		        	        
		        if (tree) {
		            tree.reload(model);
		        }

		        if (key && key !== "" && self.getNodeByKey(key)) {
		            tree.activateKey(key);
		            tree.activateKey(key).setExpanded(true);
		        }
		        
		        if (tree.getActiveNode() === null) {
		        	//取得最上層節點
		        	var topNodeKey = tree.getFirstChild().key;

		        	if (topNodeKey) {
		        		tree.activateKey(topNodeKey);
						tree.activateKey(topNodeKey).setExpanded(true);
					}
		        }

		    };
		    // 取得root node
		    this.getRootNode = function () {
		    	var tree = Ember.$(treeSelector).fancytree("getTree");

		    	//取得最上層節點
		        var topNodeKey = tree.getFirstChild();
		        
		        return topNodeKey;
		    };

		    //以指定key值與指定名稱為項目改名
		    this.rename = function (key, name) {
				
		        var node = Ember.$(treeSelector).fancytree("getTree").getNodeByKey(key);
		        	 	        
		        if (node) {
		        	
		        	// 變更node title       	
		        	//node.setTitle(name);  // Fails
		        	// http://discuss.emberjs.com/t/ember-1-8-you-must-use-ember-set-to-set-the-property/6582
		        	Ember.set(node, 'title', name);  // works
		        	node.renderTitle();
		        }
		    };

		    //取得選中項目節點
		    this.getActiveNode = function () {

		        var node = Ember.$(treeSelector).fancytree("getActiveNode");
		        if (node) {
		            return node;
		        }

		    };

		    //取得選中項目path
		    this.getActiveNodePath = function () {

		    	var node = Ember.$(treeSelector).fancytree("getActiveNode");
		        if (node) {
		            return node.getKeyPath();
		        }
		        else {
		        	return "";
		        }
		    };

		    //
		    this.loadKeyPath = function (path) {

		    	var tree = Ember.$(treeSelector).fancytree("getTree");

		    	if (path && path !== "") {
			    	tree.loadKeyPath(path, function(node, status){
						if(status === "loaded") {
						    //console.log("loaded intermiediate node " + node);
						} else if(status === "ok") {
						    self.activateNodeByKey(node.key);
						    tree.activateKey(node.key).setExpanded(true);
						}
					});
		    	}
		    };
		    
			//待測試
		    //尋訪整棵樹，並執行指定的操作
		    this.visitTree = function (callback) {

		        Ember.$("#tree").fancytree("getTree").visit(function (node) {

		            if (typeof callback === 'function') {
		                return callback(node);
		            }

		        }, false);

		    };
		  
		    //待測試
		    //指定某個節點下，尋訪子樹，並執行指定的操作
		    this.visitSubTree = function (node, callback) {

		        if (node) {

		            node.visit(function (ftNode) {

		                if (typeof callback === 'function') {
		                    return callback(ftNode);
		                }

		            }, true);

		        }

		    };
			
		    /*
		    // fancytree 無Silently()，待修改
		    //以指定的key值選取某個項目，但不觸發onActivate callback
		    //第二個傳入參數是指定在選中項目後的操作
		    this.activateSilently = function (key, callback) {

		        var node = Ember.$(treeSelector).fancytree("getTree").getNodeByKey(key);
		        

		        if (node) {
		            node.activateSilently();
		            if (typeof callback === 'function') {
		                callback();
		            }
		        }
				
		    };   
			*/
		    //待測試
		    //重新選中已選取的項目，會觸發onActivate
		    this.reactivate = function () {

		        var tree = Ember.$(treeSelector).fancytree("getTree");

		        if (tree) {
		            tree.reactivate();
		        }

		    };
		    
		    //初始化
		    //this.reload();
		    //預設Activate Node
		    if (typeof (treeOptions.defaultActivateNodeKey) !== 'undefined') {
				self.activateNodeByKey(treeOptions.defaultActivateNodeKey);
		        self.expandNodeByKey(treeOptions.defaultActivateNodeKey);
			}
		    				
			this.set('treeCustomMethods', {
				activateNodeByKey: this.activateNodeByKey,
				deactivateNodeByKey: this.deactivateNodeByKey,
				getNodeByKey: this.getNodeByKey,
				getParent: this.getParent,
				getSelectedNodes: this.getSelectedNodes,
				reload: this.reload,
				rename: this.rename,
				getActiveNode: this.getActiveNode,
				getActiveNodePath: this.getActiveNodePath,
				loadKeyPath: this.loadKeyPath,
				visitTree: this.visitTree,
				visitSubTree: this.visitSubTree,
				reactivate: this.reactivate,
				expandNodeByKey: this.expandNodeByKey,
				getRootNode: this.getRootNode
				
			});	
		});	

	}.on('didInsertElement')
	
});
