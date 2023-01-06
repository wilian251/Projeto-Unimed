sap.ui.define([
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "../model/columnsSupplier",
    "../model/declimobtransp",
    "sap/m/MessageBox",
    "sap/m/Label",
    "sap/m/ColumnListItem"
],
function (
    BaseController,
    Sorter,
    Filter,
    FilterOperator,
    JSONModel,
    Fragment,
    Formatter,
    ColumnsSupplier,
    declimobtransp,
    MessageBox,
    Label,
    ColumnListItem
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

            onPressGeneratePDF: function(oEvent) {
                let oModel = this.getModel("supplier").getData();

                let oPath = `/FileSet(Line='${this._line}',TransportName='${("0000000000" + oModel.supplierCode).slice(-10)}',TransportPlate='${oModel.licensePlate}',TransportCnpjCpf='${oModel.CNPJAndCPF}',TransportEmbPed='${oModel.embPed}',TransportVolumes='${oModel.volumes}')/$value`,
                    sUrl  = this.getModel("GW_DCIMOBTP").sServiceUrl + oPath;

                window.open(sUrl);

                this._DialogTransport.close();
            },

            onPressGenerete: async function(oEvent) {
                this.setAppBusy(true);

                let oItems = this.byId("SmartTable").getTable().getSelectedItems();

                if(oItems.length != 0){
                    let oDocumentNumber = "",
                        oPlant          = "",
                        bValid          = true;

                    oItems.map(sItem => {
                        let oObject = sItem.getBindingContext().getObject();

                        if(oDocumentNumber === "" && oPlant === "") {
                            oDocumentNumber = oObject.belnr;
                            oPlant          = oObject.werks;
                        }else {
                            if(oDocumentNumber != oObject.belnr || oPlant != oObject.werks) {
                                bValid = false;
                                return;
                            }
                        }
                    });

                    if(!bValid) MessageBox.warning(this.getResourceBundle().getText("messageWarningDocumentNumberDifferent"));
                    else {
                        let oLine = "";

                        oItems.map(sItem => {
                            let oObject = sItem.getBindingContext().getObject();

                            oLine += oObject.bukrs + "," + 
                                     ("000000000000" + oObject.anln1).slice(-12) + "," +
                                     ("0000" + oObject.anln2).slice(-4) + "," +
                                     oObject.gjahr + "," +
                                     ("00000" + oObject.lnran).slice(-5) + "," +
                                     oObject.werks + "," +
                                     oObject.h_blart + ";"
                        });

                        this._line = oLine;
                        await this._openDialogTransport();
                    }

                    this.setAppBusy(false);
                }else{
                    this.setAppBusy(false);
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

            onValueHelpRequestedSupplier: function(oEvent) {
                if (!this._oValueHelpDialogSupplier) {
                    this._oValueHelpDialogSupplier = Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.declimobtransp.view.fragments.SupplierValueHelp",
                        controller: this
                    }).then(
                        function(oFragment) {
                            this.getView().addDependent(oFragment);
                            return oFragment;
                        }.bind(this)
                    );
                }
                this._oValueHelpDialogSupplier.then(function(oValueHelpDialog) {
                    oValueHelpDialog.open();
                }.bind(this));
            },

            onHandleSearch: function(oEvent) {
                let sValue   = oEvent.getParameter("value");
                let oFilter  = new Filter({
                    filters: [
                        new Filter("lifnr", FilterOperator.Contains, sValue),
                        new Filter("lifnr_Text", FilterOperator.Contains, sValue)
                    ],
                    and: false
                });

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpSupplierOk: function(oEvent) {
                let oItem = oEvent.getParameter("selectedItem")
                this.byId("lifnr").setSelectedKey(oItem.getAggregation("cells")[0].getProperty("text"));
                //this.byId("lifnr").setValue(oItem.getAggregation("cells")[0].getProperty("text"));
            },

            onValueHelpSupplierCancel: function(oEvent) {
                oEvent.getSource().getBinding("items").filter([]);
            },

            onDialoTransportCancel: function(oEvent) {
                this.byId("lifnr").setSelectedKey("");
                this.byId("lifnr").setValue("");
                this._DialogTransport.close();
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("declimobtransp").setData(declimobtransp.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("declimobtransp").refresh(true);

                this.getModel().read("/ZFI_CDS_PROVIDER", {
                    success: function(oData) {
                        this.getModel("supplier").setData(
                            { 
                                items: oData.results,
                                supplierCode: "",
                                licensePlate: "",
                                CNPJAndCPF: "",
                                embPed: "",
                                volumes: ""
                            }
                        );
                        this.getModel("supplier").refresh(true);
                    }.bind(this),
                    error: function(oError) {
                        this.getModel("supplier").setData(
                            { 
                                items: [],
                                supplierCode: "",
                                licensePlate: "",
                                CNPJAndCPF: "",
                                embPed: "",
                                volumes: ""
                            }
                        );
                        this.getModel("supplier").refresh(true);
                    }.bind(this)
                });
            },

            _openDialogTransport: async function(){
                if(!this._DialogTransport){
                    this._DialogTransport = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.declimobtransp.view.fragments.Transport",
                        controller: this
                    })
                    
                    await this._DialogTransport.then(
                        function(oFragment){
                            this.getView().addDependent(oFragment);
    
                            this._DialogTransport = oFragment;
                        }.bind(this)
                    );
                }			
    
                this._DialogTransport.open();
            }
        });
    });
