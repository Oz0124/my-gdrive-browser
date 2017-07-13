import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
	resizeEventId: function() {
        let elementId = this.get('elementId');

        return "resize." + elementId;
    }.property('elementId'),

	actions: {
		trash: function (fileItem) {
			this.sendAction("showTrashFileDialog", fileItem);
		},
		edit: function (fileItem) {
			this.sendAction("showEditFileNameDialog", fileItem);
		},
		delete: function (fileItem) {
			this.sendAction("showDeleteFileDialog", fileItem);
		},
		recovery: function (fileItem) {
			this.sendAction("recoveryFile", fileItem);
		}
	},
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
        
        this.$().height(containerHeight - 80);
    },

    willDestroyElement: function() {
        let resizeEventId = this.get('resizeEventId');
        $(window).unbind(resizeEventId);
    }
});
