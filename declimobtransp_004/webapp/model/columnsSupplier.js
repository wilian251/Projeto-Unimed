sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function() {
			return [
                {
                    label: "Código Fornecedor",
					property: "lifnr",
                    width: "6rem"
                },
                {
                    label: "Descrição",
					property: "lifnr_Text",
                    width: "12rem"
                }
            ]
		}
	};
});