sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller,
	UIComponent,
	mobileLibrary,
	Filter,
	FilterOperator) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;
	return Controller.extend("com.prestativ.unmd.declimobtransp.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		/**
		 * Convenience method to define the busy State
		 * @public
		 * @param {Boolean} bBusy Busy State 
		 */
		setAppBusy: function(bBusy) {
			this.getModel("appView").setProperty("/busy", bBusy);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		_formateValue: function(oValueInit, oId) {
            let position = oValueInit.indexOf("-"),
                oCifrao  = "";

            if(position === -1){
                oCifrao = "R$ ";
            }else {
                oCifrao = "R$ -";
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
	})
});