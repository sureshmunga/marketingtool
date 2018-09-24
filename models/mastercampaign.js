var mastercampaign = {
	tableName: 'apps.mastercampaigns',
	tableProperties: {
		mastercampaignname: {
			type: String
		},
		campaigndescription: {
			type: String
		},
		campaignmanager: {
			type: String
		},
		status: {
			type: String
		},
		startdate: {
			type: String
		},
		enddate: {
			type: String
		},
		namingconvention: {
			type: String
		},
		mcampaigndigitalid: {
			type: String
		},
		isactive: {
			type: String
		},
		createdby:{
			type: String
		},
		createddate:{
			type: Date
		}
	}
};
module.exports = mastercampaign;