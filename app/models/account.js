import DS from 'ember-data';

var Account = DS.Model.extend({  
	name: DS.attr(),
	emailAddress: DS.attr(),
	picture: DS.attr(),
	isLogin: DS.attr('boolean', {defaultValue: false}),
	rootFolderId: DS.attr()
});

Account.reopenClass({
    FIXTURES: []
});

export default Account;