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
    "../model/leaseAgreements",
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
    LeaseAgreements,
    MessageBox
) {
        "use strict";

        return BaseController.extend("com.prestativ.unmd.leaseagreements.controller.Main", {
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

            onPressExecute: function(oEvent) {
                this.setAppBusy(true);

                let oItems = this.byId("SmartTable").getTable().getAggregation("items"),
                    bValid = false;

                let oLines = oItems.filter(sItem => {
                    let oCells = sItem.getAggregation("cells");

                    let oCell = oCells.find(sCell => {
                        if(sCell.sId.indexOf("input") != -1) return sCell;
                    });
                    
                    if(oCell.getProperty("value") != "") {
                        bValid = true;
                        return sItem;
                    }
                });

                if(oLines.length != 0){
                    let oLineString = "";

                    oLines.map(sItem => {
                        let oObject = sItem.getBindingContext().getObject(),
                            oCells  = sItem.getAggregation("cells");

                        let oCell = oCells.find(sCell => {
                            if(sCell.sId.indexOf("input") != -1) return sCell;
                        });
                        
                        oObject.xref1 = oCell.getProperty("value");

                        oLineString += oObject.bukrs + "," +
                                       ("0000000000" + oObject.belnr).slice(-10) + "," +
                                       oObject.gjahr + "," +
                                       oObject.buzei + "," +
                                       Formatter.dateInUTCAbap(oObject.zfbdt, "yyyyMMdd") + "," +
                                       Formatter.dateInUTCAbap(oObject.h_budat, "yyyyMMdd") + "," +
                                       oObject.h_monat + "," +
                                       oObject.lifnr + "," +
                                       oObject.wrbtr + "," +
                                       oObject.vertn + "," +
                                       oObject.xref1 + ";"
                    });

                    let oObjectSend = {
                        Line: oLineString,
                        Type: "",
                        Message: ""
                    }

                    this.getModel("GW_Lease").create("/ReturnBapiSet", oObjectSend, {
                        success: function(oData){
                            this.setAppBusy(false);
                            
                            if(oData.Type === "S") MessageBox.success(oData.Message);
                            else MessageBox.error(oData.Message);
                        }.bind(this),
                        error: function(oError){
                            this.setAppBusy(false);
                            
                            MessageBox.error(this.getResourceBundle().getText("messageErrorModifyDocuments"));
                        }.bind(this)
                    });

                }else{
                    this.setAppBusy(false);
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningFillInput"));
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
                    if(sColumn.columnId.indexOf("wrbtr")   != -1 ){
                        sColumn.width = "9rem";
                    }else 
                    if(sColumn.columnId.indexOf("zfbdt")   != -1 ||
                       sColumn.columnId.indexOf("h_budat") != -1 )
                    {
                        sColumn.type   = sap.ui.export.EdmType.Date;
				        sColumn.format = 'dd/mm/yyyy';
                    }
                });
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("leaseagreements").setData(LeaseAgreements.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("leaseagreements").refresh(true);
            },

            _openDialogReturnBapis: async function(){
                if(!this._DialogReturnBapis){
                    this._DialogReturnBapis = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.leaseagreements.view.fragments.ReturnBapis",
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
