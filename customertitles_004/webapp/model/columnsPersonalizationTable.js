sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";
    return {
        initModel: function (i18n) {
            return {
                visibleAll: true,
                items: [
                    {
                        label: i18n.kunnr,
                        id: "kunnr",
                        visible: true,
                    },
                    {
                        label: i18n.customerName,
                        id: "customerName",
                        visible: true,
                    },
                    {
                        label: i18n.bukrs,
                        id: "bukrs",
                        visible: true,
                    },
                    {
                        label: i18n.companyName,
                        id: "companyName",
                        visible: true,
                    },
                    {
                        label: i18n.documentNumber,
                        id: "belnr",
                        visible: true,
                    },
                    {
                        label: i18n.blart,
                        id: 'blart',
                        visible: true,
                    },
                    {
                        label: i18n.xblnr,
                        id: "xblnr",
                        visible: true,
                    },
                    {
                        label: i18n.bldat,
                        id: "bldat",
                        visible: true,
                    },
                    {
                        label: i18n.budat,
                        id: "budat",
                        visible: true,
                    },
                    {
                        label: i18n.bktxt,
                        id: "bktxt",
                        visible: true
                    },
                    {
                        label: i18n.bupla,
                        id: "bupla",
                        visible: true,
                    },
                    {
                        label: i18n.wrbtr,
                        id: "wrbtr",
                        visible: true
                    },
                    {
                        label: i18n.wrbtr_appl,
                        id: "wrbtr_appl",
                        visible: true,
                    }
                ]
            }
        }
    };
});