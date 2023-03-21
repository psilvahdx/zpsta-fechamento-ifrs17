sap.ui.define([
    "portoseguro/zpstafechifrs17app/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/Spreadsheet"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, formatter,JSONModel,Spreadsheet) {
    "use strict";

    return Controller.extend("portoseguro.zpstafechifrs17app.controller.JurosList", {
        formatter: formatter,
        onInit: function () {

            var oJurosListViewModel = new JSONModel({
                busy : false,
                delay : 0
            });

            this.oResourceBundle = this.getResourceBundle();
            this.formatter.setResourceBundle(this.oResourceBundle);
            this.setModel(oJurosListViewModel,"JurosListView");

            this.getRouter().getRoute("RouteJurosList").attachPatternMatched(this._onObjectMatched, this);

            this.getJurosData([]);

        },
        _onObjectMatched: function(){

        },

        onAfterRendering: function () {
            let oFilterBarBtnGo = this.byId("filterbar-btnGo"),
                oFilterBarBtnClear = this.byId("filterbar-btnClear");
            if (oFilterBarBtnGo) {
                oFilterBarBtnGo.setText(this.oResourceBundle.getText("btn_filterGo_txt"));
                oFilterBarBtnClear.setText(this.oResourceBundle.getText("btn_filterClear_txt"));
            }

        },

        getJurosData: function (aFilters) {

            let sPath = "/JurosIFRS17Set",
                oDefaultModel = this.getModel(),
                that = this,
                oListJurosModel = this.getModel("jurosIFRS17Model");

                let  oViewModel = this.getModel("JurosListView");

                oViewModel.setProperty("/busy",true);


            oDefaultModel.read(sPath, {
                    sorters: [                        
                        new sap.ui.model.Sorter("Ano", false),
                        new sap.ui.model.Sorter("Mes", false)
                    ],
                    filters: aFilters,
                    success: function (oRetrievedResult) {

                        if (oRetrievedResult.results) {
                            //monta Objeto de Lista na Estrutura da tela
                            let aListJuros = {
                                items: []
                            };
                            let aResults = oRetrievedResult.results;
                            let ObjMap = that.groupByJurosKey(aResults);
                            aListJuros.items = that.getJurosLineItemsByMap(ObjMap);
                            oListJurosModel.setData(aListJuros);
                            oListJurosModel.refresh();

                        }

                        oViewModel.setProperty("/busy",false);

                    },
                    error: function (oError) {
                        MessageToast.show("Falha ao recuperar dados");
                        oViewModel.setProperty("/busy",false);
                    }
                }

            );

        },
        groupByJurosKey: function (aResults) {

            let ObjMap = {};

            aResults.forEach(element => {
                var jurosKey = `${element.Ano}|${element.Mes}`;
                if (!ObjMap[jurosKey]) {
                    ObjMap[jurosKey] = [];
                }

                ObjMap[jurosKey].push({
                    element
                });
            });

            return ObjMap;

        },
        getJurosLineItemsByMap: function (ObjMap) {

            let aRows = [];

            for (let jurosKey of Object.keys(ObjMap)) {

                let keySplit = jurosKey.split("|");

                let oRow = {
                    Ano: keySplit[0],
                    Mes: keySplit[1],
                    Igpm: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    },
                    Ipca: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    },
                    Pfix: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    },
                    Tigp: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    },
                    Tipc: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    },
                    Tpfi: {
                        Statusarq: "999",
                        Acao: false,
                        enabled: false
                    }

                };

                for (let line of ObjMap[jurosKey]) {

                    var item = line.element;

                    if (item.Jurosref === 'IGPM') {
                        oRow.Igpm = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }
                    if (item.Jurosref === 'IPCA') {
                        oRow.Ipca = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }
                    if (item.Jurosref === 'PFIX') {
                        oRow.Pfix = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }
                    if (item.Jurosref === 'TIGP') {
                        oRow.Tigp = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }
                    if (item.Jurosref === 'TIPC') {
                        oRow.Tipc = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }
                    if (item.Jurosref === 'TPFI') {
                        oRow.Tpfi = {
                            Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                            Acao: item.Acao === "X" ? true : false
                        }
                    }                  

                }

                aRows.push(oRow);

            }

            return aRows;
        },

        getListEnabledStatusByStatus: function (oStatus) {
            let aResult = [];

            switch (oStatus) {
                case "1":
                    aResult.push({
                        statusKey: "1",
                        statusText: this.formatter.formatStatusTextFechamento("1")
                    }, {
                        statusKey: "3",
                        statusText: this.formatter.formatStatusTextFechamento("3")
                    });
                    break;

                default:
                    aResult.push({
                        statusKey: oStatus,
                        statusText: this.formatter.formatStatusTextFechamento(oStatus)
                    });
                    break;
            }


            return aResult;
        },

        enableActionsEditFechamento: function (sStatus, sAction) {
            let bEnabled = false;

            if (sStatus === '1' && sAction === "") {
                bEnabled = true;
            }


            return bEnabled;
        },

        onSelectionStatusChange: function (oEvent) {

            var oCtx = oEvent.getSource().oPropagatedProperties.oBindingContexts,
                oJurosModel = this.getModel("jurosIFRS17Model"),
                oObject = oJurosModel.getObject(oCtx.jurosIFRS17Model.getPath());

            let bEnabled = false;


            if (oEvent.getParameter("selectedItem").getKey() === '1') {
                bEnabled = true;
            }

            switch (oEvent.getSource().getId()) {
                case "cbStatusPrg":
                    oObject.Prg.enabled = bEnabled;
                    oObject.Prg.Acao = bEnabled;
                    break;
                case "cbStatusTve":
                    oObject.Tve.enabled = bEnabled;
                    oObject.Tve.Acao = bEnabled;
                    break;
                case "cbStatusRvne":
                    oObject.Rvne.enabled = bEnabled;
                    oObject.Rvne.Acao = bEnabled;
                    break;    
                case "cbStatusVec":
                    oObject.Vec.enabled = bEnabled;
                    oObject.Vec.Acao = bEnabled;
                    break;
                case "cbStatusBecf":
                    oObject.Becf.enabled = bEnabled;
                    oObject.Becf.Acao = bEnabled;
                    break;
                case "cbStatusJuros":
                    oObject.Juros.enabled = bEnabled;
                    oObject.Juros.Acao = bEnabled;
                    break;
                case "cbStatusBt":
                    oObject.Bt.enabled = bEnabled;
                    oObject.Bt.Acao = bEnabled;
                    break;
            }


        },


        onSearch: function (oEvent) {
            var oFilterBar = this.byId("filterbar"),
                oTable = this.byId("tblJurosIFRS17");
            var aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl(),
                    aFilters = [],
                    aSelectedKeys = [];

                if (oControl.getId().includes("picker")) {

                    aFilters = [new Filter({
                        path: 'Ano',
                        operator: FilterOperator.EQ,
                        value1: oControl.getValue()
                    })];

                    if (oControl.getValue().length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }


                } else {

                    aSelectedKeys = oControl.getSelectedKeys(),
                        aFilters = aSelectedKeys.map(function (sSelectedKey) {
                            return new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.Contains,
                                value1: sSelectedKey
                            });
                        });

                    if (aSelectedKeys.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }

                }


                return aResult;
            }, []);

            this.getJurosData(aTableFilters);
         
        },
        onClearFilter: function () {
            var oFilterBar = this.byId("filterbar"),
                oTable = this.byId("tblJurosIFRS17");
            var aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                var oControl = oFilterGroupItem.getControl();

                if (oControl.getId().includes("picker")) {

                    oControl.setValue();
                } else {
                    oControl.removeAllSelectedItems();
                }


                return aResult;
            }, []);

            this.getJurosData(aTableFilters);
        },
        onStateFechamentoChange: function (oEvent) {

            var oStateFechamentoControl = oEvent.getSource(),                   
                oCtx = oStateFechamentoControl.oPropagatedProperties.oBindingContexts,
                that = this,
                oFechamentoModel = this.getModel("fechamentoIFRS17Model"),
                oObject = oFechamentoModel.getObject(oCtx.fechamentoIFRS17Model.getPath());


            let sMessage = `Confirma a liberação do Fechamento IFRS17 no Período ${oObject.Mes}/${oObject.Ano} para Empresa ${oObject.Bukrs}?`;

            if (oEvent.getParameter("state")) {

                MessageBox.confirm(sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction == MessageBox.Action.YES) {

                            oObject.EtapasValidas = false;
                            that.sendLiberacaoFechamentoIFRS17(oObject);                               
                        } else {
                            oStateFechamentoControl.setState(false);

                        }
                    }
                });

            }

        },
        onActionFechamentoChange: function (oEvent){

            var oActionFechamentoControl = oEvent.getSource(),                  
                oCtx = oActionFechamentoControl.oPropagatedProperties.oBindingContexts,
                oFechamentoModel = this.getModel("fechamentoIFRS17Model"),
                oObject = oFechamentoModel.getObject(oCtx.fechamentoIFRS17Model.getPath()),
                sFileName = oEvent.getSource().getParent().getParent().getParent().getParent().getTitle();


            let sMessage = `Após Salvar, o Arquivo: ${sFileName} para Empresa: ${oObject.Bukrs} , Ano: ${oObject.Ano} e Mês: ${oObject.Mes},
            será movido para o diretório de arquivos a serem processados. \n Deseja continuar?`;

            if (oEvent.getParameter("state")) {

                MessageBox.confirm(sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction == MessageBox.Action.NO) {
                            oActionFechamentoControl.setState(false);
                        }
                    }
                });

            }

        },       
        onJurosItemPress: function (oEvent) {
            var that = this,
                oSelectedItem = oEvent.getSource(),
                sDialogName = "",
                oJurosIFRS17Model = this.getModel("jurosIFRS17Model"),
                oContext = oSelectedItem.oBindingContexts,
                sPath = oContext.jurosIFRS17Model.getPath(),
                oObject = oJurosIFRS17Model.getObject(sPath);

           
                sDialogName = "portoseguro.zpstafechifrs17app.view.dialogs.DisplayStepsJuros";
                if (!this.oDialogDisplay) {
                    this.oDialogDisplay = Fragment.load({
                        name: sDialogName,
                        controller: this
                    });

                }
                this.oDialogDisplay.then(function (oDialogDisplay) {
                    that.getView().addDependent(oDialogDisplay);
                    oDialogDisplay.bindElement({
                        path: sPath,
                        model: "jurosIFRS17Model"
                    });
                    oDialogDisplay.open();
                }.bind(this));           


        },
        onCancel: function (oEvent) {         
            sap.ui.getCore().byId("displayJurosDialog").close();        
        },        
        onNavToLogErros: function(oEvent){

            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                target: {
                    semanticObject: "ZSOFPSL",
                    action: "zpsta_fechifrs17_log"
                },
                params: {
                }
            })) || ""; // generate the Hash to display a Supplier
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: hash
                }
            });
        },
        onNavToValidaArquivos: function(oEvent){

            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                target: {
                    semanticObject: "ZSOFPSL",
                    action: "ZPSFP_0007"
                },
                params: {
                }
            })) || ""; // generate the Hash to display a Supplier
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: hash
                }
            });
        },
        onShowLogErros: function(oEvent){

            var that = this;
            let sDialogName = "",                 
                oCtx = oEvent.getSource().oPropagatedProperties.oBindingContexts,
                oJurosModel = this.getModel("jurosIFRS17Model"),
                oSelectedItem = oJurosModel.getObject(oCtx.jurosIFRS17Model.getPath());
                
              
                switch (oEvent.getParameter("id")) {
                    case "btnIgpmShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'IGPM';
                        break;                   
                    case "btnIpcaShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'IPCA';
                        break;                   
                    case "btnPfixShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'PFIX';
                        break;                   
                    case "btnTigpShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'TIGP';
                        break;   
                    case "btnTipcShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'TIPC';
                        break;                                 
                    case "btnTpfiShowLogError":
                        oSelectedItem.TipoProcessoFilter = 'TPFI';
                        break;  
                }



            that.selectedItemFilter = oSelectedItem;    

      
            sDialogName = "portoseguro.zpstafechifrs17app.view.dialogs.DisplayLogErrosJuros";
            if (!this.oDialogDisplayLogErrosJuros) {
                this.oDialogDisplayLogErrosJuros = Fragment.load({
                    name: sDialogName,
                    controller: this
                });

            }
            this.oDialogDisplayLogErrosJuros.then(function (oDialogDisplayLogErros) {
                that.getView().addDependent(oDialogDisplayLogErros);
                
                let aFilters = [new Filter({
                    path: 'Ano',
                    operator: FilterOperator.EQ,
                    value1: that.selectedItemFilter.Ano
                }),
                new Filter({
                    path: 'Mes',
                    operator: FilterOperator.EQ,
                    value1: that.selectedItemFilter.Mes
                }),
                new Filter({
                    path: 'Tipoprocesso',
                    operator: FilterOperator.EQ,
                    value1: 'JUR'
                }),
                new Filter({
                    path: 'Jurosref',
                    operator: FilterOperator.EQ,
                    value1: oSelectedItem.TipoProcessoFilter
                })];
                sap.ui.getCore().byId("tblLogErrosJuros").getBinding("rows").filter(aFilters);


                oDialogDisplayLogErros.open();
            }.bind(this));

        },
        onCloseLogDialog: function (oEvent) {                           
            sap.ui.getCore().byId("displayLogErrosJuros").close();                       
            
        },
        createColumnConfig: function() {
            var aCols = [];
            
            aCols.push({label: 'Empresa', property: 'Bukrs'});
            aCols.push({label: 'Ano', property: 'Ano'});
            aCols.push({label: 'Mes', property: 'Mes'});            
            aCols.push({label: 'Dataproc', property: 'Dataproc', type: 'date'});
            aCols.push({label: 'Horaproc', property: 'Horaproc', type: sap.ui.export.EdmType.Time});
            aCols.push({label: 'Tipoprocesso', property: 'Tipoprocesso'});
            aCols.push({label: 'JurosRef', property: 'Jurosref'});
            aCols.push({label: 'Linha Arq', property: 'Numlinhaarq'});
            aCols.push({label: 'Nome Arq', property: 'Nomearquivo'});
            aCols.push({label: 'Erro desc', property: 'Erro'});

            return aCols;
        },

        
        onExportLog: function() {
            var aCols, oSettings, oSheet;


            var oTable = sap.ui.getCore().byId("tblLogErrosJuros");
            var oRowBinding = oTable.getBinding('rows');

            aCols = this.createColumnConfig();

            var oModel = oRowBinding.getModel();

            oSettings = {
                workbook: { columns: aCols, context: {sheetName: 'LOG_ERROS_ARQUIVO'}},
                dataSource: {
                    type: 'odata',
                    dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
                    serviceUrl: this._sServiceUrl,
                    headers: oModel.getHeaders ? oModel.getHeaders() : null,
                    count: oRowBinding.getLength ? oRowBinding.getLength() : null,
                    useBatch: true },
                fileName: `LOG_ERROS_ARQUIVO_IFRS17.xlsx`
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build()
                .then( function() {
                    MessageToast.show('Sucesso ao exportar!');
                })
                .finally(oSheet.destroy);
        }

    });
});