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
    ColumnsSupplier,
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

            onPressGenerete: async function(oEvent) {
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
                        await this._openDialogTransport();
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

            onValueHelpRequestedSupplier: function(oEvent) {
                let aCols = ColumnsSupplier.initModel();

                Fragment.load({
                    name: "com.prestativ.unmd.declimobtransp.view.fragments.SupplierValueHelp",
                    controller: this
                }).then(function name(oFragment) {
                    this._oValueHelpDialogSupplier = oFragment;
                    this.getView().addDependent(this._oValueHelpDialogSupplier);
    
                    this._oValueHelpDialogSupplier.getTableAsync().then( async function (oTable) {

                        this.getModel().read("/ZFI_CDS_PROVIDER", {
                            success: function(oData) {

                            }.bind(this),
                            error: function(oError) {

                            }.bind(this)
                        });

                        oTable.setModel(new JSONModel(sap.ui.require.toUrl("sap/opu/odata/sap/ZFI_CDS_DECLIMOBTRASNP_CDS/")));
                        oTable.setModel(new JSONModel(aCols), "columns");
    
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/ZFI_CDS_PROVIDER");
                        }
    
                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/ZFI_CDS_PROVIDER", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
    
                        this._oValueHelpDialogSupplier.update();
                    }.bind(this));
    
                    this._oValueHelpDialogSupplier.open();
                }.bind(this));
            },

            onValueHelpSupplierOk: function(oEvent) {
                let aTokens = oEvent.getParameter("tokens");
                this._oInput.setSelectedKey(aTokens[0].getKey());
                this._oValueHelpDialogSupplier.close();
            },

            onValueHelpSupplierCancel: function(oEvent) {
                this._oValueHelpDialogSupplier.close();
            },

            onValueHelpSupplierAfterClose: function(oEvent) {
                this._oValueHelpDialogSupplier.destroy();
            },
            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("declimobtransp").setData(declimobtransp.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("declimobtransp").refresh(true);
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
