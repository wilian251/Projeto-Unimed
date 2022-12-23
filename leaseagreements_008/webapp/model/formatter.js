sap.ui.define([] , function () {
	"use strict";

	return {
        currencyInBRL: function(sValue) {
            return Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(sValue) ;
        },

        realInAmount: function(sValue) {
            sValue = sValue.replace("R$", "").replaceAll(".", "").trim();

            sValue = sValue.replace(",", ".");

            return sValue;
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
        },

        formateValue: function(oValueInit, oId) {
            let position = oValueInit.indexOf("-"),
                oCifrao  = "";

            if(position === -1){
                //oCifrao = "R$ ";
            }else {
                oCifrao = "-";
            }

            let oValue = Number(oValueInit.replace("R$ ", "").replace("-","").replaceAll(".","").replace(",","").replaceAll("_","")).toString();
            let one, two, three, oFor;

            switch (oValue.length) {
				case 1:
                    one = 0;
                    two = oValue.substring(0, 2);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},0${two}`);
                    }else {
                        return `${oCifrao}${one},0${two}`
                    }
                    break
                case 2:
                    one = 0;
                    two = oValue.substring(0, 2);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},${two}`);
                    }else {
                        return `${oCifrao}${one},${two}`
                    }
                    break
                case 3:
                    one = oValue.substring(0, 1);
                    two = oValue.substring(1, 3);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},${two}`);
                    }else {
                        return `${oCifrao}${one},${two}`
                    }
                    break
                case 4:
                    one = oValue.substring(0, 2);
                    two = oValue.substring(2, 4);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},${two}`);
                    }else {
                        return `${oCifrao}${one},${two}`
                    }
                    break
                case 5:
                    one = oValue.substring(0, 3);
                    two = oValue.substring(3, 5);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},${two}`);
                    }else {
                        return `${oCifrao}${one},${two}`
                    }
                    break
                case 6:
                    one   = oValue.substring(0, 1);
                    two   = oValue.substring(1, 4);
                    three = oValue.substring(4, 6);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                    }else {
                        return `${oCifrao}${one}.${two},${three}`
                    }
                    break
                case 7:
                    one   = oValue.substring(0, 2);
                    two   = oValue.substring(2, 5);
                    three = oValue.substring(5, 7);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                    }else {
                        return `${oCifrao}${one}.${two},${three}`
                    }
                    break
                case 8:
                    one   = oValue.substring(0, 3);
                    two   = oValue.substring(3, 6);
                    three = oValue.substring(6, 8);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                    }else {
                        return `${oCifrao}${one}.${two},${three}`
                    }
                    break
                case 9:
                    one   = oValue.substring(0, 1);
                    two   = oValue.substring(1, 4);
                    three = oValue.substring(4, 7);
                    oFor  = oValue.substring(7, 9);
                    if(oId){
                         this.byId(oId).setValue(`${oCifrao}${one}.${two}.${three},${oFor}`);
                    }else {
                        return `${oCifrao}${one}.${two}.${three},${oFor}`
                    }
                    break;
                case 10:
                    one   = oValue.substring(0, 2);
                    two   = oValue.substring(2, 5);
                    three = oValue.substring(5, 8);
                    oFor  = oValue.substring(8, 10);
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one}.${two}.${three},${oFor}`);
                    }else {
                        return `${oCifrao}${one}.${two}.${three},${oFor}`
                    }
                    break
                default:
                    one = "0";
                    two = "00";
                    if(oId){
                        this.byId(oId).setValue(`${oCifrao}${one},${two}`);
                    }else {
                        return `${oCifrao}${one},${two}`
                    }
                    break
            }
        },
	};

});