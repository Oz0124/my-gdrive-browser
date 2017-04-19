import Ember from 'ember';

export default Ember.Component.extend({
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
	}
});
