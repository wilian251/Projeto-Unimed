sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		initSelectionModel: function(sHeaderTitleTable) {
			return {
				releaseDate: null,
				documentDate: null,
				State: {
					vanquireleaseDateshedDate: {
						Enabled: true,
						ValueState: sap.ui.core.ValueState.None,
						ValueStateText: ""
					},
					documentDate: {
						Enabled: true,
						ValueState: sap.ui.core.ValueState.None,
						ValueStateText: ""
					}
				},
				headerTitleTable: sHeaderTitleTable,
				items: []
			}
		}
	};
});