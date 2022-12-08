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

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            onPressGenerete: function(oEvent) {
                this.setAppBusy(true);

                let oItems = this.byId("SmartTable").getTable().getAggregation("items"),
                    bValid = false;

                if(oItems.length != 0){

                    //let oObject = sItem.getBindingContext().getObject();         

                }else{
                    this.setAppBusy(false);
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningSelectedLine"));
                }
            },

            onReturnBapisCancel: function(oEvent) {
                this._DialogReturnBapis.close();
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
            },

            _openDialogReturnBapis: async function(){
                if(!this._DialogReturnBapis){
                    this._DialogReturnBapis = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.declimobtransp.view.fragments.ReturnBapis",
                        controller: this
                    })
                    
                    await this._DialogReturnBapis.then(
                        function(oFragment){
                            this.getView().addDependent(oFragment);
    
                            this._DialogReturnBapis = oFragment;
                        }.bind(this)
                    );
                }			
    
                this._DialogReturnBapis.open();
            }
        });
    });
