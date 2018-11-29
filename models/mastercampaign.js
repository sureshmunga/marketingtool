var mastercampaign = {
	tableName: 'apps.mastercampaigns',
	tableProperties: {
		mastercampaignid: {
			type: String
		},
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
			type: Date
		},
		enddate: {
			type: Date
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
		},
		updatedby:{
			type: String
		},
		updateddate:{
			type: Date
		}
	}
};
module.exports = mastercampaign;