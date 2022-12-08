sap.ui.define([] , function () {
	"use strict";

	return {
        currencyInBRL: function(sValue) {
            return Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(sValue) ;
        },
        
        dateInUTCAbap: function(sValue, sPattern) {
            return sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: sPattern,
                UTC: false
            }).format(sValue);
        },

        typeStatus: function(sValue) {
            switch (sValue) {
                case "E":
                    return "sap-icon://message-error";
                    break;
                case "S":
                    return "sap-icon://message-success";
                    break;
            }
        },

        typeStatusState: function(sValue) {
            switch (sValue) {
                case "E":
                    return "Error";
                    break;
                case "S":
                    return "Success";
                    break;
            }
        }

	};

});