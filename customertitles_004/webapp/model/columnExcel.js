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
                    label: i18n.customerName,
					property: "customerName",
					type: sap.ui.export.EdmType.String,
                    width: "14rem"
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
                    width: "14rem"
                },
                {
                    label: i18n.documentNumber,
					property: "belnr",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: i18n.blart,
					type: sap.ui.export.EdmType.String,
                    property: ['blart', 'typeDocumentName'],
				    template: '{0} - {1}',
                    width: "10rem"
                },
                {
                    label: i18n.xblnr,
					property: "xblnr",
				    type: sap.ui.export.EdmType.String,
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
                    label: i18n.budat,
				    property: "budat",
					type: sap.ui.export.EdmType.Date,
				    format: 'dd/mm/yyyy',
                    width: "8rem"
                },
                {
                    label: i18n.bktxt,
				    property: "bktxt",
                    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: i18n.bupla,
					property: "bupla",
				    type: sap.ui.export.EdmType.String,
                    width: "6rem"
                },
                {
                    label: i18n.wrbtr,
				    property: "wrbtr",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: i18n.wrbtr_appl,
				    property: "wrbtr_appl",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                }
            ]
		}
	};
});