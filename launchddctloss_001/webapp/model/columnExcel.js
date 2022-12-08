sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function(i18n) {
			return [
                {
                    label: i18n.kunnr,
					property: "kunnr",
					type: sap.ui.export.EdmType.String,
                    width: "5rem"
                },
                {
                    label: i18n.clientName,
					property: "clientName",
					type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: i18n.bukrs,
					property: "bukrs",
				    type: sap.ui.export.EdmType.String,
                    width: "5rem"
                },
                {
                    label: i18n.companyName,
					property: "companyName",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: i18n.gjahr,
					property: "gjahr",
				    type: sap.ui.export.EdmType.String,
                    width: "6rem"
                },
                {
                    label: i18n.belnr,
					property: "belnr",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: i18n.buzei,
				    property: "buzei",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: i18n.budat,
				    property: "budat",
					type: sap.ui.export.EdmType.Date,
				    format: 'dd/mm/yyyy',
                    width: "8rem"
                },
                {
                    label: i18n.bldat,
				    property: "bldat",
                    type: sap.ui.export.EdmType.Date,
				    format: 'dd/mm/yyyy',
                    width: "8rem"
                },
                {
                    label: i18n.blart,
					type: sap.ui.export.EdmType.String,
                    property: ['blart', 'typeDocumentName'],
				    template: '{0} - {1}',
                    width: "8rem"
                },
                {
                    label: i18n.zuonr,
					type: sap.ui.export.EdmType.String,
                    property: "zuonr",
                    width: "8rem"
                },
                {
                    label: i18n.wrbtr,
				    property: "wrbtr",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: i18n.days_delay,
				    property: "days_delay",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                }
            ]
		}
	};
});