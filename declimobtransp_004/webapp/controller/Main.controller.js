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
                //this.setAppBusy(true);

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

            onPersoButtonPressed: function (oEvent) {
                if(this._oTPC != null){
                    this._oTPC.openDialog();
                    this._oTPC.attachPersonalizationsDone(this, this._onPerscoDonePressed.bind(this));
                }
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("declimobtransp").setData(declimobtransp.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("declimobtransp").refresh(true);
            },

            
			_onPerscoDonePressed: function (oEvent) {
                this._oTPC.savePersonalizations();
            },

            _createFilters: function() {
                let oCompanyID          = this.byId("container-customertitles---main--smartFilterBar-filterItemControlA_-bukrs"),
                    oClientID           = this.byId("container-customertitles---main--smartFilterBar-filterItemControlA_-kunnr"),
                    oAccountingEntryID  = this.byId("container-customertitles---main--smartFilterBar-filterItemControlA_-blart"),
                    oBusinessLocationID = this.byId("container-customertitles---main--smartFilterBar-filterItemControlA_-bupla");
            
                let oFilters = [];

                if(oCompanyID === undefined){
                    oCompanyID = this.byId("application-ZSEM_FI225_CUSTTITLES_001-display-component---main--smartFilterBar-filterItemControlA_-bukrs");
                }

                if(oClientID === undefined){
                    oClientID = this.byId("application-ZSEM_FI225_CUSTTITLES_001-display-component---main--smartFilterBar-filterItemControlA_-kunnr");
                }
                
                if(oAccountingEntryID === undefined){
                    oAccountingEntryID  = this.byId("application-ZSEM_FI225_CUSTTITLES_001-display-component---main--smartFilterBar-filterItemControlA_-blart");
                }
                
                if(oBusinessLocationID === undefined){
                    oBusinessLocationID = this.byId("application-ZSEM_FI225_CUSTTITLES_001-display-component---main--smartFilterBar-filterItemControlA_-bupla");
                }

                if(oCompanyID.getTokens().length != 0){
                    let oFilterCompany = this._searchSelectedValues(oCompanyID.getTokens(), "bukrs");

                    oFilters.push(new Filter({
                        filters: oFilterCompany,
                        and: false
                    }));
                }

                if(oClientID.getTokens().length != 0){
                    let oFilterClient = this._searchSelectedValues(oClientID.getTokens(), "kunnr");

                    oFilters.push(new Filter({
                        filters: oFilterClient,
                        and: false
                    }));
                }
                
                if(oAccountingEntryID.getTokens().length != 0){
                    let oFilterAccountingEntry = this._searchSelectedValues(oAccountingEntryID.getTokens(), "blart");

                    oFilters.push(new Filter({
                        filters: oFilterAccountingEntry,
                        and: false
                    }));
                }

                if(oBusinessLocationID.getTokens().length != 0){
                    let oFilterBusinessLocation = this._searchSelectedValues(oBusinessLocationID.getTokens(), "blart");

                    oFilters.push(new Filter({
                        filters: oFilterBusinessLocation,
                        and: false
                    }));
                }

                return oFilters;
            },

            _searchSelectedValues: function(sTokens, sPath){
                let oFilter = [];

                for(let oToken of sTokens){
                    if(sPath === "kunnr") {
                        oFilter.push(new Filter({
                            path: sPath,
                            operator: FilterOperator.EQ,
                            value1: ("0000000000" + oToken.getProperty("key")).slice(-10),
                            and: false
                        }));
                    }else{    
                        oFilter.push(new Filter({
                            path: sPath,
                            operator: FilterOperator.EQ,
                            value1: oToken.getProperty("key"),
                            and: false
                        }));

                    }
                }

                return oFilter;
            },

            _personalizationTable: function () {
                this._oTPC = null;
                
                let oPersonalizationService;

                try {
                    oPersonalizationService = sap.ushell.Container.getService("Personalization");
                } catch (error) {
                    
                }

                if(oPersonalizationService != undefined){
                    let oPersonalizer = oPersonalizationService.getPersonalizer({
                        container: "com.prestativ.unmd.declimobtransp", // This key must be globally unique (use a key to
                        // identify the app) Note that only 40 characters are allowed
                        item: "itemDataTable" // Maximum of 40 characters applies to this key as well
                    });
                    this._oTPC = new TablePersoController({
                        table: this.byId("table"),
                        //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                        componentName: "table",
                        persoService: oPersonalizer
                    }).activate();
                }
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
