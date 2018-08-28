var tactic = {
    tableName: 'apps.tactic',
    tableProperties: {
		tacticName: {
			type: String
		},
		tacticDescription: {
			type: String
		},
		VisitedDate: {
			type: String
		},
		Status: {
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
        Vendor : {
            type:String
        },
		namingConvention: {
			type: String
		},
		tCampaignDigitalId: {
			type: String
        },
        BusinessGroupId: {
			type: String
        },
        BusinessLineId: {
			type: String
		},
		IsActive: {
			type: String
        },
        CreatedBy: {
			type: String
        },
        UpdatedBy: {
			type: String
        },
        CreatedDate: {
			type: String
        },
        UpdatedDate: {
			type: String
        },
        ProgramId: {
			type: String
        },
        MCASegmentId: {
			type: String
        },
        ProgramJobId: {
			type: String
        },
        clientId: {
			type: String
        }
	}
};

module.exports = tactic;