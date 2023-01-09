sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		initSelectionModel: function(sHeaderTitleTable) {
			return {
				id: "",
				hktid: "",
				simpleForm: {
					account: "",
					corporateBank: "",
					documentDate: null,
					releaseDate: null,
					accountingEntry: "",
					headerText: "",
					State: {
						account: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						},
						corporateBank: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						},
						documentDate: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						},
						releaseDate: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						},
						accountingEntry: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						},
						headerText: {
							Enabled: true,
							ValueState: sap.ui.core.ValueState.None,
							ValueStateText: ""
						}
					}
				},
				headerTitleTable: sHeaderTitleTable,
				items: []
			}
		}
	};
});