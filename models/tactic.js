var tactic = {
    tableName: 'apps.tactic',
    tableProperties: {
		tacticName: {
			type: String
		},
		tacticDescription: {
			type: String
		},
		visiteddate: {
			type: String
		},
		status: {
			type: String
		},
		startDate: {
			type: String
		},
		endDate: {
			type: String
        },
        tacticTypeId : {
            type: String
        },
        vendor : {
            type:String
        },
		namingConvention: {
			type: String
		},
		tcampaigndigitalId: {
			type: String
        },
        businessgroupid: {
			type: String
        },
        businesslineid: {
			type: String
		},
		businesstypeid : {
			type : String
		},
		industryid : {
			type : String
		},
		isactive: {
			type: String
        },
        createdby: {
			type: String
        },
        updatedby: {
			type: String
        },
        createddate: {
			type: String
        },
        updateddate: {
			type: String
        },
        programid: {
			type: String
        },
        mcasegmentid: {
			type: String
        },
        programjobid: {
			type: String
        },
        clientId: {
			type: String
        }
	}
};

module.exports = tactic;