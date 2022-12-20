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
                        visible: true
                    },
                    {
                        label: i18n.clientName,
                        id: "clientName",
                        visible: true
                    },
                    {
                        label: i18n.bukrs,
                        id: "bukrs",
                        visible: true
                    },
                    {
                        label: i18n.companyName,
                        id: "companyName",
                        visible: true
                    },
                    {
                        label: i18n.gjahr,
                        id: "gjahr",
                        visible: true
                    },
                    {
                        label: i18n.belnr,
                        id: "belnr",
                        visible: true
                    },
                    {
                        label: i18n.buzei,
                        id: "buzei",
                        visible: true
                    },
                    {
                        label: i18n.budat,
                        id: "budat",
                        visible: true
                    },
                    {
                        label: i18n.bldat,
                        id: "bldat",
                        visible: true
                    },
                    {
                        label: i18n.blart,
                        id: 'blart',
                        visible: true
                    },
                    {
                        label: i18n.zuonr,
                        id: "zuonr",
                        visible: true
                    },
                    {
                        label: i18n.wrbtr,
                        id: "wrbtr",
                        visible: true
                    },
                    {
                        label: i18n.days_delay,
                        id: "days_delay",
                        visible: true
                    }
                ]
            }
        }
    };
});