sap.ui.define([
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "sap/m/TablePersoController",
    "sap/ui/export/Spreadsheet",
    "../model/columnExcel",
    "../model/declimobtransp",
    "sap/m/MessageBox"
],
function (
    BaseController,
    Sorter,
    Filter,
    FilterOperator,
    JSONModel,
    Fragment,
    Formatter,
    TablePersoController,
    Spreadsheet,
    ColumnExcel,
    declimobtransp,
    MessageBox
) {
        "use strict";

        return BaseController.extend("com.prestativ.unmd.declimobtransp.controller.Main", {
            formatter: Formatter,
            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */
            onInit: function () {
                this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched.bind(this), this);
            },

            onAfterRendering: function(oEvent) {
                this.byId("SmartTable").getTable().setMode("MultiSelect");
                this.byId("SmartTable").getTable().setGrowing(true);
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            onPressGenerete: function(oEvent) {
                //this.setAppBusy(true);

                let oItems = this.byId("SmartTable").getTable().getSelectedItems();

                if(oItems.length != 0){
                    let oDocumentNumber = "",
                        bValid          = true;

                    oItems.map(sItem => {
                        let oObject = sItem.getBindingContext().getObject();

                        if(oDocumentNumber === "") oDocumentNumber = oObject.belnr;
                        else {
                            if(oDocumentNumber != oObject.belnr) {
                                bValid = false;
                                return;
                            }
                        }
                    });

                    if(!bValid) MessageBox.warning(this.getResourceBundle().getText("messageWarningDocumentNumberDifferent"));
                    else {

                    }
                }else{
                    this.setAppBusy(false);bhg
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningSelectedLine"));
                }
            },

            onFormatterCurrencyAmount: function(oEvent) {
                let oValue = oEvent.getParameter("value").replace("R$", "").replace(",", ".").trim();

                if(oValue != ""){
                    this._formateValue(oValue, oEvent.getParameter("id"));
                }
            },

            onBeforeExport: function (oEvent) {
                let mExcelSettings = oEvent.getParameter("exportSettings");

                if(mExcelSettings.url) return;
                
                mExcelSettings.worker = false;

                let oColumns = oEvent.getParameter("exportSettings").workbook.columns;

                oColumns.map(sColumn => {
                    if(sColumn.columnId.indexOf("bukrs")   != -1 ){
                        sColumn.width = "17rem";
                    }
                    else 
                    if(sColumn.columnId.indexOf("anbtr")   != -1 ){
                        sColumn.width = "9rem";
                    }else 
                    if(sColumn.columnId.indexOf("budat") != -1 ){
                        sColumn.type   = sap.ui.export.EdmType.Date;
				        sColumn.format = 'dd/mm/yyyy';
                    }
                });
            },
            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("declimobtransp").setData(declimobtransp.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("declimobtransp").refresh(true);
            }
        });
    });
