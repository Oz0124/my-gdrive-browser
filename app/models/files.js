import DS from 'ember-data';

var Files = DS.Model.extend({
	fileId: DS.attr(),
    mimeType: DS.attr(),
	iconLink: DS.attr(),
	title: DS.attr(),
	ownerNames: DS.attr(),
	lastModifyingUserName: DS.attr(),
	modifiedDate: DS.attr(),
	fileSize: DS.attr(),
	fileExtension: DS.attr(),
	fileSizeString: DS.attr(),
	webContentLink: DS.attr(),
	explicitlyTrashed: DS.attr(),
	alternateLink: DS.attr(),
	modifiedDateString: DS.attr(),
	isExpanded: DS.attr(),
	sharedWithMeDate: DS.attr(),
	isRootFolder: DS.attr('boolean', {defaultValue: false})
});

Files.reopenClass({
    FIXTURES: []
});

export default Files;



		   
			
						
			