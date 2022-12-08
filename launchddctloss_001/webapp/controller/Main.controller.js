sap.ui.define([
    "./BaseController",
    "../model/launchDDCTLoss",
    "../model/columnExcel",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../model/formatter",
    "sap/m/TablePersoController", 
],

    function (
        BaseController, 
        LaunchDDCTLoss, 
        ColumnExcel, 
        Spreadsheet, 
        Sorter, 
        Filter, 
        FilterOperator, 
        JSONModel, 
        Fragment, 
        MessageBox,
        Formatter,
        TablePersoController
    ){
        "use strict";

        return BaseController.extend("com.prestativ.unmd.launchddctloss.controller.Main", {
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

            onGroup: function(oEvent) {
                let oID    = oEvent.getParameter("column").getId(),
                    oModel = this.getModel("launchddctloss").getData();

                oID = oID.replace("container-launchddctloss---main--", "");

                oID = oID.replace("application-ZSEM_FI25_LAUNCH_004-display-component---main--", "");

                let oItems = oModel.items.filter(sItem => {
                    if(sItem.key != "") return sItem;
                });
                
                oModel.items = oItems;
                
                let oUniques = oModel.items.filter(function (a) {
                    return !this[a[oID]] && (this[a[oID]] = true);
                }, Object.create(null));

                oUniques.map(sUnique => {
                    let oValue = 0;

                    oModel.items.map(sItem => {
                        if(sUnique[oID] === sItem[oID]){
                            oValue += parseFloat(sItem.wrbtr);
                        }
                    });

                    oModel.items.push({
                        key: "",
                        belnr: oID === "belnr" ? sUnique[oID] : "",
                        blart: oID === "blart" ? sUnique[oID] : "",
                        bldat: oID === "bldat" ? sUnique[oID] : "",
                        bschl: oID === "bschl" ? sUnique[oID] : "",
                        budat: oID === "budat" ? sUnique[oID] : "",
                        bukrs: oID === "bukrs" ? sUnique[oID] : "",
                        buzei: oID === "buzei" ? sUnique[oID] : "",
                        clientName: oID === "clientName" ? sUnique[oID] : "",
                        companyName: oID === "companyName" ? sUnique[oID] : "",
                        days_delay: oID === "days_delay" ? sUnique[oID] : "",
                        days_delay: oID === "days_delay" ? sUnique[oID] : "",
                        dmbtr: oID === "dmbtr" ? sUnique[oID] : "",
                        gjahr: oID === "gjahr" ? sUnique[oID] : "",
                        hkont: oID === "hkont" ? sUnique[oID] : "",
                        koart: oID === "koart" ? sUnique[oID] : "",
                        kunnr: oID === "kunnr" ? sUnique[oID] : "",
                        p_Dt_Vencd: oID === "p_Dt_Vencd" ? sUnique[oID] : "",
                        shkzg: oID === "shkzg" ? sUnique[oID] : "",
                        typeDocumentName: oID === "typeDocumentName" ? sUnique[oID] : "",
                        valor_ate: oID === "valor_ate" ? sUnique[oID] : "",
                        valor_de: oID === "valor_de" ? sUnique[oID] : "",
                        waers: oID === "waers" ? sUnique[oID] : "",
                        wrbtr: oValue.toFixed(2),
                        xblnr: oID === "xblnr" ? sUnique[oID] : "",
                        zuonr: oID === "zuonr" ? sUnique[oID] : "",
                        selectionColumnVisible: false,
                        selectionColumn: false
                    });
                });

                this.getModel("launchddctloss").refresh(true);
            },

            onSelectedAllLines: function(oEvent){
				let oItems    = this.getModel("launchddctloss").getData().items,
					oSelected = oEvent.getParameter("selected");

                oItems.map(sItem => {
					if(sItem.selectionColumnVisible != false){
						sItem.selectionColumn = oSelected;
					}
				});

				this.getModel("launchddctloss").refresh(true);
			},

            onOpenDialog: async function(oEvent) {
                let oModel = this.getModel("launchddctloss").getData();

                let oItems = oModel.items.filter(sItem => {
                    if(sItem.selectionColumn === true) return sItem;
                });

                if(oItems.length != 0){
                    await this._openDialogDocumentReleaseDates();
                }else{
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningSelectLines"));
                }
            },

            onDocumentReleaseDatesCancel: function(oEvent){
                this.byId("documentDate").setProperty("value", "");
                this.byId("releaseDate").setProperty("value", "");

                this._DialogDocumentReleaseDates.close();
            },

            onChangeDocumentReleaseDates: function(oEvent) {
                let oReleaseID      = this.byId("releaseDate"),
                    oDocumentDateID = this.byId("documentDate"),
                    bValid          = true;

                [oReleaseID, oDocumentDateID].forEach(sField => {
                    if(sField.getProperty("value") != ""){
                        sField.setProperty("valueState", "None");
                        sField.setProperty("valueStateText", "");
                    }else{
                        bValid = false;
                        sField.setProperty("valueState", "Error");
                        sField.setProperty("valueStateText", this.getResourceBundle().getText("dialogDocumentReleaseDatesValueStateError"));
                    }
                });

                if(bValid) this.byId("buttonLaunchDDCTLoss").setProperty("enabled", true);
                else this.byId("buttonLaunchDDCTLoss").setProperty("enabled", false);
            },

            onReturnBapisCancel: function(oEvent) {
                this._DialogReturnBapis.close();
            },

            onLaunchDDCTLoss: function(oEvent){
                this.setAppBusy(true);

                let oVanquishedDateID = this.byId("container-launchddctloss---main--smartFilterBar-filterItemControlA_-_Parameter.p_Dt_Vencd");

                if(oVanquishedDateID === undefined){
                    oVanquishedDateID = this.byId("application-ZSEM_FI25_LAUNCH_004-display-component---main--smartFilterBar-filterItemControlA_-_Parameter.p_Dt_Vencd")
                }

                let oModel               = this.getModel("launchddctloss").getData(),
                    oDateParameter       = Formatter.dateInUTCAbap(oVanquishedDateID.getProperty("dateValue"), "yyyy-MM-dd"),
                    oValueCompany        = "",
                    oValueClient         = "",
                    oValueExercise       = "",
                    oValueDocumentNumber = "",
                    oValueItem           = "";

                let oItems = oModel.items.filter(sItem => {
                    if(sItem.selectionColumn === true) return sItem;
                });

                oItems.map(sItem => {
                    if(oValueCompany  === "" && oValueClient         === "" &&
                        oValueExercise === "" && oValueDocumentNumber === "" &&
                        oValueItem     === "")
                    {
                        oValueCompany        = sItem.bukrs,
                        oValueClient         = sItem.kunnr,
                        oValueExercise       = sItem.gjahr,
                        oValueDocumentNumber = sItem.belnr,
                        oValueItem           = sItem.buzei;
                    }else{
                        oValueCompany        += "," + sItem.bukrs,
                        oValueClient         += "," + sItem.kunnr,
                        oValueExercise       += "," + sItem.gjahr,
                        oValueDocumentNumber += "," + sItem.belnr,
                        oValueItem           += "," + sItem.buzei;
                    }
                });

                this.getModel("GW_Launch").callFunction("/ReturnLaunchddctloss", {
				    urlParameters: {
                        pDtVencd: oDateParameter,
                        Company: oValueCompany,
                        Client: oValueClient,
                        Exercise: oValueExercise,
                        DocumentNumber: oValueDocumentNumber,
                        Item: oValueItem,
                        DocumentDate: Formatter.dateInUTCAbap(this.byId("documentDate").getProperty("dateValue"), "yyyy-MM-dd"),
                        ReleaseDate: Formatter.dateInUTCAbap(this.byId("releaseDate").getProperty("dateValue"), "yyyy-MM-dd")
                    },
                    success: async function(oData) {
                        this.setAppBusy(false);

                        this.getModel("returnBapis").setData({ rows: oData.results.length < 10 ? oData.results.length : 10, items: oData.results })
                        this.getModel("returnBapis").refresh(true);

                        await this._openDialogReturnBapis();

                        console.log(oData);
                    }.bind(this),
                    error: function(oError) {
                        this.setAppBusy(false);
                        console.log(oError);
                    }.bind(this)
                });
                
                this._DialogDocumentReleaseDates.close();
            },

            onExportExcel: function(oEvent){
                let oCurrentDate = Formatter.dateInUTCAbap(new Date(), "dd-MM-yyyy HH:mm:ss");

                let oTitle = `${this.getResourceBundle().getText("mainTableTitle")} - ${oCurrentDate}`,
                    oModel = this.getModel("launchddctloss").getData();

                let oItems = oModel.items.filter(sItem => {
                    if(sItem.key != "") return sItem;
                });

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

			onPersoButtonPressed: function (oEvent) {
                if(this._oTPC != null){
                    this._oTPC.openDialog();
                    this._oTPC.attachPersonalizationsDone(this, this._onPerscoDonePressed.bind(this));
                }
            },

            onPressGoReport: function(oEvent) {
                let oVanquishedDateID = this.byId("container-launchddctloss---main--smartFilterBar-filterItemControlA_-_Parameter.p_Dt_Vencd");

                if(oVanquishedDateID === undefined){
                    oVanquishedDateID = this.byId("application-ZSEM_FI25_LAUNCH_004-display-component---main--smartFilterBar-filterItemControlA_-_Parameter.p_Dt_Vencd")
                }

                if(oVanquishedDateID.getProperty("value") != ""){
                    this.setAppBusy(true);

                    this.getModel("launchddctloss").getData().headerTitleTable = this.getResourceBundle().getText("mainTableTitle");
                    this.getModel("launchddctloss").getData().items = [];
                    this.getModel("launchddctloss").refresh(true);


                    let oDateFormatted = Formatter.dateInUTCAbap(oVanquishedDateID.getProperty("dateValue"), "yyyy-MM-ddTHH:mm:ss");

                    let oPath = this.getModel().createKey("/ZFI_CDS_LAUNCH_DDCT_LOSS", {
                            p_Dt_Vencd: oDateFormatted
                        });

                    oPath += "/Set";

                    let oFilters = this._createFilters();

                    this.getModel().read(oPath, {
                        filters: oFilters,
                        success: function(oData){
                            this.setAppBusy(false);

                            oData.results.map(sItem => {
                                sItem.key                    = Math.random();
                                sItem.selectionColumnVisible = true;
                                sItem.selectionColumn        = false;
                                sItem.typeDocument           = `${sItem.blart} - ${sItem.typeDocumentName}`;
                            });

                            this.getModel("launchddctloss").getData().headerTitleTable = this.getResourceBundle().getText("mainTableTitleParms", [oData.results.length])
                            this.getModel("launchddctloss").getData().items = oData.results;
                            this.getModel("launchddctloss").refresh(true);

                            this.byId("checkBoxColumn").setVisible(true);
                        }.bind(this),
                        error: function(oError){
                            this.setAppBusy(false);
                            MessageBox.error(this.getResourceBundle().getText("messageErrorSearchData"));
                        }.bind(this)
                    });
                }
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.getModel("launchddctloss").setData(LaunchDDCTLoss.initSelectionModel(this.getResourceBundle().getText("mainTableTitle")));
                this.getModel("launchddctloss").refresh(true);

                let oI18n = {
                    kunnr: this.getResourceBundle().getText("mainTableClient"),
                    clientName: this.getResourceBundle().getText("mainTableCustomerName"),
                    bukrs: this.getResourceBundle().getText("mainTableCompany"),
                    companyName: this.getResourceBundle().getText("mainTableCompanyName"),
                    gjahr: this.getResourceBundle().getText("mainTableExercise"),
                    belnr: this.getResourceBundle().getText("mainTableDocumentNumber"),
                    buzei: this.getResourceBundle().getText("mainTableItem"),
                    budat: this.getResourceBundle().getText("mainTableReleaseDate"),
                    bldat: this.getResourceBundle().getText("mainTableDocumentDate"),
                    blart: this.getResourceBundle().getText("mainTableDocumentType"),
                    zuonr: this.getResourceBundle().getText("mainTableAssignment"),
                    wrbtr: this.getResourceBundle().getText("mainTableTransactionCurrencyAmount"),
                    days_delay: this.getResourceBundle().getText("mainTableDaysDelay")
                }

                this._columnExcel = ColumnExcel.initModel(oI18n);
                //this._personalizationTable();
            },

            _personalizationTable: function () {
                this._oTPC = null;
                var oPersonalizationService = sap.ushell.Container.getService("Personalization");
                var oPersonalizer = oPersonalizationService.getPersonalizer({
                    container: "com.prestativ.unmd.launchddctloss",
                    item: "itemDataTable"
                });
                this._oTPC = new TablePersoController({
                    table: this.byId("tableLaunchDDCTLoss"),
                    componentName: "table",
                    persoService: oPersonalizer
                }).activate();
            },

            _onPerscoDonePressed: function (oEvent) {
                this._oTPC.savePersonalizations();
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

                    }else if(sPath === "valor_de"){
                        oFilter.push(new Filter({
                            path: sPath,
                            operator: FilterOperator.GE,
                            value1: oToken.getProperty("key"),
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
            
            _createFilters: function() {
                let oCompanyID = this.byId("container-launchddctloss---main--smartFilterBar-filterItemControlA_-bukrs"),
                    oClientID  = this.byId("container-launchddctloss---main--smartFilterBar-filterItemControlA_-kunnr"),
                    oStatusID  = this.byId("container-launchddctloss---main--smartFilterBar-filterItemControlA_-valor_de");
            
                let oFilters = [];

                if(oCompanyID === undefined){
                    oCompanyID = this.byId("application-ZSEM_FI25_LAUNCH_004-display-component---main--smartFilterBar-filterItemControlA_-bukrs");
                }

                if(oClientID === undefined){
                    oClientID = this.byId("application-ZSEM_FI25_LAUNCH_004-display-component---main--smartFilterBar-filterItemControlA_-kunnr");
                }

                if(oStatusID === undefined){
                    oStatusID = this.byId("application-ZSEM_FI25_LAUNCH_004-display-component---main--smartFilterBar-filterItemControlA_-valor_de");
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
                
                if(oStatusID.getTokens().length != 0){
                    let oFilterStatus = this._searchSelectedValues(oStatusID.getTokens(), "valor_de");

                    oFilters.push(new Filter({
                        filters: oFilterStatus,
                        and: false
                    }));
                }

                return oFilters;
            },

            _openDialogDocumentReleaseDates: async function(){
                if(!this._DialogDocumentReleaseDates){
                    this._DialogDocumentReleaseDates = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.launchddctloss.view.fragments.DocumentReleaseDates",
                        controller: this
                    })
                    
                    await this._DialogDocumentReleaseDates.then(
                        function(oFragment){
                            this.getView().addDependent(oFragment);
    
                            this._DialogDocumentReleaseDates = oFragment;
                        }.bind(this)
                    );
                }			
    
                this._DialogDocumentReleaseDates.open();
            },

            _openDialogReturnBapis: async function(){
                if(!this._DialogReturnBapis){
                    this._DialogReturnBapis = new Fragment.load({
                        id: this.getView().getId(),
                        name: "com.prestativ.unmd.launchddctloss.view.fragments.ReturnBapis",
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
