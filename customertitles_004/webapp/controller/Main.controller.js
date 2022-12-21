sap.ui.define([
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter",
    "../model/columnsPersonalizationTable",
    "sap/ui/export/Spreadsheet",
    "../model/columnExcel",
    "../model/customerTitles",
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
    ColumnsPersonalizationTable,
    Spreadsheet,
    ColumnExcel,
    CustomerTitles,
    MessageBox
) {
        "use strict";

        return BaseController.extend("com.prestativ.unmd.customertitles.controller.Main", {
            formatter: Formatter,
            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */
            onInit: function () {
                this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched.bind(this), this);
            },

            onExit: function () {
				this._oTPC.destroy();
			},

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            onSelectCompensateRB: function(oEvent) {
                let oID = oEvent.getParameter("id");

                if(oID.indexOf("Origin") != -1){
                    this.byId("containerAccountCorporateBank").setProperty("visible", true);
                    this.byId("containerAccount").setProperty("visible", true);
                    this.byId("containerCorporateBank").setProperty("visible", true);
                }else if(oID.indexOf("Specific") != -1){
                    this.byId("containerAccountCorporateBank").setProperty("visible", true);
                    this.byId("containerAccount").setProperty("visible", true);
                    this.byId("containerCorporateBank").setProperty("visible", false);
                }else{
                    this.byId("containerAccountCorporateBank").setProperty("visible", true);
                    this.byId("containerAccount").setProperty("visible", true);
                    this.byId("containerCorporateBank").setProperty("visible", false);
                }
            },

            onValidationFields: function(oEvent) {
                let aFields         = [this.byId("documentDate"), this.byId("releaseDate"), this.byId("accountingEntry"), this.byId("headerText")],
                    oGroupCompIndex = this.byId("GroupCompensate").getProperty("selectedIndex"),
                    bValid          = true;

                if(oGroupCompIndex === 0){
                    aFields.push(this.byId("account"));
                    aFields.push(this.byId("corporateBank"));
                }else if(oGroupCompIndex === 1){
                    aFields.push(this.byId("account"));
                }else if(oGroupCompIndex === 2){
                    aFields.push(this.byId("account"));
                }

                aFields.forEach(sField => {
                    let oValue = sField.getProperty("value");

                    if(oValue === ""){
                        bValid = false;

                        sField.setProperty("valueState", sap.ui.core.ValueState.Error);
                        sField.setProperty("valueStateText", this.getResourceBundle().getText("messageErrorFieldRequired"));
                    }else{
                        sField.setProperty("valueState", sap.ui.core.ValueState.None);
                        sField.setProperty("valueStateText", "");
                    }
                });

                if(bValid) this.byId("launchCustomerTitles").setProperty("enabled", true);
                else this.byId("launchCustomerTitles").setProperty("enabled", false);
                
            },

            onReturnBapisCancel: function(oEvent) {
                this._DialogReturnBapis.close();
            },

            onLaunchCustomerTitles: function(oEvent) {
                let oModel = this.getModel("customerTitles").getData();

                let oItemsCompensate = oModel.items.filter(sItem => {
                    if(sItem.wrbtr_appl != "") return sItem;
                });
                

                if(oItemsCompensate.length != 0){
                    this.setAppBusy(true);

                    let oAccount         = this.byId("account").getSelectedKey(),
                        oCorporateBank   = this.byId("corporateBank").getSelectedKey(),
                        oDocumentDate    = Formatter.dateInUTCAbap(this.byId("documentDate").getProperty("dateValue"), "yyyy-MM-dd"),
                        oReleaseDate     = Formatter.dateInUTCAbap(this.byId("releaseDate").getProperty("dateValue"), "yyyy-MM-dd"),
                        oAccountingEntry = this.byId("accountingEntry").getSelectedKey(),
                        oHeaderText      = this.byId("headerText").getProperty("value"),
                        oGroupCompIndex  = this.byId("GroupCompensate").getProperty("selectedIndex"),
                        oAmountAllocated = "";


                    oItemsCompensate.forEach(function(sItem) {
                        let oValueCustomer = ("0000000000" + sItem.kunnr).slice(-10)

                        if(oAmountAllocated === ""){
                            oAmountAllocated = `${sItem.bukrs},${oValueCustomer},${sItem.gjahr},${sItem.belnr},${sItem.buzei},${Formatter.realInAmount(sItem.wrbtr_appl)}`;
                        }else{
                            oAmountAllocated += ";" + `${sItem.bukrs},${oValueCustomer},${sItem.gjahr},${sItem.belnr},${sItem.buzei},${Formatter.realInAmount(sItem.wrbtr_appl)}`;
                        }
                    });

                    //Verifico qual compensação o usuário escolheu
                    if(oGroupCompIndex === 1){
                        oCorporateBank = "";
                    }else if(oGroupCompIndex === 2){
                        //oAccount       = "",
                        oCorporateBank = "";
                    }

                    this.getModel("GW_CustTitles").callFunction("/LaunchCustomerTitles", {
                        urlParameters: {
                            Account: oAccount,
                            CorporateBank: oCorporateBank,
                            DocumentDate: oDocumentDate,
                            ReleaseDate: oReleaseDate,
                            AccountingEntry: oAccountingEntry,
                            HeaderText: oHeaderText,
                            AmountAllocated: oAmountAllocated,
                            BapiName: oModel.id
                        },
                        success: async function(oData) {
                            this.setAppBusy(false);

                            this.getModel("returnBapis").setData(
                                { 
                                    rows: oData.results.length < 10 ? oData.results.length : 10, 
                                    items: oData.results 
                                }
                            );
                            this.getModel("returnBapis").refresh(true);

                            await this._openDialogReturnBapis();
                        }.bind(this),
                        error: function(oError) {
                            this.setAppBusy(false);
                            MessageBox.error(this.getResourceBundle().getText("messageErrorLaunchCustomerTitles"));
                        }.bind(this)
                    });

                    this._DialogClientSecrClear.close();
                }
            },

            onFormatterCurrencyAmount: function(oEvent) {
                let oValue = oEvent.getParameter("value").replace("R$", "").replace(",", ".").trim();

                if(oValue != ""){
                    this._formateValue(oValue, oEvent.getParameter("id"));
                }
            },

            onCompensatePartialTotal: async function(oEvent){
                let oModel        = this.getModel("customerTitles").getData(),
                    oCompensateID = oEvent.getParameter("id").indexOf("partial");

                let oItemsCompensate = oModel.items.filter(sItem => {
                    if(sItem.wrbtr_appl != "") return sItem;
                });

                if(oItemsCompensate.length != 0){
                    oModel.id = oCompensateID != -1 ? "partial" : "total";
                    this.getModel("customerTitles").refresh(true);

                    await this._openDialogClientSecrClearing();
                }else{
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningAmountAllocatedFill"));
                }
            },

            onClientSecrClearingCancel: function(oEvent){
                this._DialogClientSecrClear.close();
            },

            onExportExcel: function(oEvent){
                let oCurrentDate = Formatter.dateInUTCAbap(new Date(), "dd-MM-yyyy HH:mm:ss");

                let oTitle = `${this.getResourceBundle().getText("mainViewTableTitle")} - ${oCurrentDate}`,
                    oItems = this.getModel("customerTitles").getData().items;

                new sap.ui.export.Spreadsheet({
                    workbook: { 
                        columns: this._columnExcel
                    },
                    sheetName: oTitle,
                    metaSheetName: oTitle,
                    dataSource: oItems,
                    fileName: `${oTitle}.xlsx`,
                    worker: false
                }).build();
            },

            onPressGoReport: function(oEvent) {
                this.setAppBusy(true);

                this.getModel("customerTitles").getData().headerTitleTable = this.getResourceBundle().getText("mainViewTableTitle");
                this.getModel("customerTitles").getData().items = [];
                this.getModel("customerTitles").refresh(true);

                let oFilters = this._createFilters();

                this.getModel().read("/ZFI_CDS_RETURN_TITCLI", {
                    filters: oFilters,
                    success: function(oData){
                        this.setAppBusy(false);
                        this.getModel("customerTitles").getData().headerTitleTable = this.getResourceBundle().getText("mainViewTableTitleParms", [oData.results.length])
                        this.getModel("customerTitles").getData().items = oData.results;
                        this.getModel("customerTitles").refresh(true);
                        
                        let oAccount = [],
                            oFilters = [];

                        oData.results.map(sItem => {
                            sItem.wrbtr_appl = "";

                            oAccount.push(new Filter({
                                path: "saknr",
                                operator: FilterOperator.EQ,
                                value1: sItem.hkont,
                                and: false
                            }));
                        });

                        oFilters.push(new Filter({
                            filters: oAccount,
                            and: false
                        }));

                        oFilters.push(new Filter({
                            filters:[
                                new Filter({
                                    path: "belnr",
                                    operator: FilterOperator.EQ,
                                    value1: "1231",
                                    and: false
                                })
                            ],
                            and: false
                        }));

                        this.getModel("GW_CustTitles").read("/SearchHelpAccountSet", {
                            filters: oFilters,
                            success: function(oData) {
                                this.getModel("account").setData({ items: oData.results });
                                this.getModel("account").refresh(true);
                            }.bind(this),
                            error: function(oError) {
                                //MessageBox.error(this.getResourceBundle().getText("messageErrorSearchData"));
                            }.bind(this)
                        });

                    }.bind(this),
                    error: function(oError){
                        this.setAppBusy(false);
                        MessageBox.error(this.getResourceBundle().getText("messageErrorSearchData"));
                    }.bind(this)
                });
            },

			onPersoButtonPressed: function (oEvent) {
                this._personalizationTable();
            },

            onPressConfirm: function(oEvent) {
                let oModel    = this.getModel("personalizationTable").getData();

                oModel.items.map(sItem => {
                    this.byId(sItem.id).setVisible(sItem.visible);
                });

                this.getModel("personalizationTable").refresh(true);

                this._DialogPersonalizationTable.close();
            },

            onPressCancel: function(oEvent) {
                this._DialogPersonalizationTable.close();
            },

            onPressSelectColumnsAll: function(oEvent) {
                let oModel    = this.getModel("personalizationTable").getData(),
                    oSelected = oEvent.getParameter("selected");

                oModel.items.map(sItem => {
                    sItem.visible = oSelected;
                });

                oModel.visibleAll = oSelected;

                this.getModel("personalizationTable").refresh(true);
            },

            onPressSelectColumn: function(oEvent) {
                let oModel = this.getModel("personalizationTable").getData();

                let oItem = oModel.items.find(sItem => {
                    if(sItem.visible === false) return sItem;
                });

                if(oItem != undefined) oModel.visibleAll = false;
                else oModel.visibleAll = true;

                this.getModel("personalizationTable").refresh(true);
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("customerTitles").setData(CustomerTitles.initSelectionModel(this.getResourceBundle().getText("mainViewTableTitle")));
                this.getModel("customerTitles").refresh(true);

                let oI18n = {
                    kunnr: this.getResourceBundle().getText("mainTableClient"),
                    customerName: this.getResourceBundle().getText("mainTableCustomerName"),
                    bukrs: this.getResourceBundle().getText("mainTableCompany"),
                    companyName: this.getResourceBundle().getText("mainTableCompanyName"),
                    documentNumber: this.getResourceBundle().getText("mainTableDocumentNumber"),
                    blart: this.getResourceBundle().getText("mainTableDocumentType"),
                    xblnr: this.getResourceBundle().getText("mainTableReferenceDocument"),                
                    bldat: this.getResourceBundle().getText("mainTableDocumentDate"),
                    budat: this.getResourceBundle().getText("mainTableReleaseDate"),
                    bktxt: this.getResourceBundle().getText("mainTableHeaderText"),
                    bupla: this.getResourceBundle().getText("mainTablePlaceOfBusiness"),
                    wrbtr: this.getResourceBundle().getText("mainTableTransactionCurrencyAmount"),
                    wrbtr_appl: this.getResourceBundle().getText("mainTableAmountAllocated")
                }

                this._columnExcel = ColumnExcel.initModel(oI18n);

                this.getModel("personalizationTable").setData(ColumnsPersonalizationTable.initModel(oI18n));
                this.getModel("personalizationTable").refresh(true);
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

            _personalizationTable: async function () {
                if(!this._DialogPersonalizationTable){
                    this._DialogPersonalizationTable = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.customertitles.view.fragments.PersonalizationTableDialog",
                        controller: this
                    })
                    
                    await this._DialogPersonalizationTable.then(
                        function(oFragment){
                            this.getView().addDependent(oFragment);
    
                            this._DialogPersonalizationTable = oFragment;
                        }.bind(this)
                    );
                }
    
                this._DialogPersonalizationTable.open();
            },

            _openDialogClientSecrClearing: async function(){
                if(!this._DialogClientSecrClear){
                    this._DialogClientSecrClear = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.customertitles.view.fragments.ClientSecuritiesClearing",
                        controller: this
                    })
                    
                    await this._DialogClientSecrClear.then(
                        function(oFragment){

                            this.getView().addDependent(oFragment);
    
                            this._DialogClientSecrClear = oFragment;
                        }.bind(this)
                    );
                }			
    
                this._DialogClientSecrClear.open();
            },

            _openDialogReturnBapis: async function(){
                if(!this._DialogReturnBapis){
                    this._DialogReturnBapis = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.customertitles.view.fragments.ReturnBapis",
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
