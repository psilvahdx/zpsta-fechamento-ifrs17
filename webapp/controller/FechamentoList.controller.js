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

        return Controller.extend("portoseguro.zpstafechifrs17app.controller.FechamentoList", {
            formatter: formatter,
            onInit: function () {

                var ofechamentoListViewModel = new JSONModel({
                    busy : false,
                    delay : 0
                });

                this.oResourceBundle = this.getResourceBundle();
                this.formatter.setResourceBundle(this.oResourceBundle);
                this.setModel(ofechamentoListViewModel,"fechamentoListView");

                this.getFechamentoData([]);

            },
            onAfterRendering: function () {
                let oFilterBarBtnGo = this.byId("filterbar-btnGo"),
                    oFilterBarBtnClear = this.byId("filterbar-btnClear");
                if (oFilterBarBtnGo) {
                    oFilterBarBtnGo.setText(this.oResourceBundle.getText("btn_filterGo_txt"));
                    oFilterBarBtnClear.setText(this.oResourceBundle.getText("btn_filterClear_txt"));
                }

            },

            getFechamentoData: function (aFilters) {

                let sPath = "/FechamentoIFRS17Set",
                    oDefaultModel = this.getModel(),
                    that = this,
                    oListFechamentoModel = this.getModel("fechamentoIFRS17Model");

                    let  oViewModel = this.getModel("fechamentoListView");

                    oViewModel.setProperty("/busy",true);


                oDefaultModel.read(sPath, {
                        sorters: [
                            new sap.ui.model.Sorter("Bukrs", false),
                            new sap.ui.model.Sorter("Ano", false),
                            new sap.ui.model.Sorter("Mes", false),
                        ],
                        filters: aFilters,
                        success: function (oRetrievedResult) {

                            if (oRetrievedResult.results) {
                                //monta Objeto de Lista na Estrutura da tela
                                let aListFechamento = {
                                    items: []
                                };
                                let aResults = oRetrievedResult.results;
                                let ObjMap = that.groupByFechamentoKey(aResults);
                                aListFechamento.items = that.getFechamentoLineItemsByMap(ObjMap);
                                oListFechamentoModel.setData(aListFechamento);
                                oListFechamentoModel.refresh();

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
            groupByFechamentoKey: function (aResults) {

                let ObjMap = {};

                aResults.forEach(element => {
                    var fechamentoKey = `${element.Bukrs}|${element.Ano}|${element.Mes}`;
                    if (!ObjMap[fechamentoKey]) {
                        ObjMap[fechamentoKey] = [];
                    }

                    ObjMap[fechamentoKey].push({
                        element
                    });
                });

                return ObjMap;

            },
            getFechamentoLineItemsByMap: function (ObjMap) {

                let aRows = [];

                for (let fechamentoKey of Object.keys(ObjMap)) {

                    let keySplit = fechamentoKey.split("|");

                    let oRow = {
                        Bukrs: keySplit[0],
                        Ano: keySplit[1],
                        Mes: keySplit[2],
                        Prg: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Vec: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Bca: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Bcd: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Tve: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Rvne: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Juros: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        Bt: {
                            Statusarq: "999",
                            Acao: false,
                            enabled: false
                        },
                        LiberaFechamento: false,
                        EtapasValidas: false,

                    };

                    for (let line of ObjMap[fechamentoKey]) {

                        var item = line.element;

                        if (item.Tipoarqproc === 'PRG') {
                            oRow.Prg = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)

                            }
                        }
                        if (item.Tipoarqproc === 'VEC') {
                            oRow.Vec = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                        if (item.Tipoarqproc === 'BCA') {
                            oRow.Bca = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                        if (item.Tipoarqproc === 'BCD') {
                            oRow.Bcd = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                        if (item.Tipoarqproc === 'RCR') {
                            oRow.Tve = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                        if (item.Tipoarqproc === 'RVN') {
                            oRow.Rvne = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                       /* if (item.Tipoarqproc === 'JUROS') {
                            oRow.Juros = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }*/
                        if (item.Tipoarqproc === 'BT') {
                            oRow.Bt = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false,
                                enabled: this.enableActionsEditFechamento(item.Statusarq, item.Acao)
                            }
                        }
                        if (item.Tipoarqproc === 'FECHAMENTO') {
                            if (item.Acao === "X") {
                                oRow.LiberaFechamento = true
                            }
                        }

                        //oRow.LiberaFechamento = item.Acao === "1" ? true : false;
                        oRow.EtapasValidas = this.enableLiberarFechamento(oRow);
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
                    oFechamentoModel = this.getModel("fechamentoIFRS17Model"),
                    oObject = oFechamentoModel.getObject(oCtx.fechamentoIFRS17Model.getPath());

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
                    oTable = this.byId("tblFechamentoIFRS17");
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

                this.getFechamentoData(aTableFilters);
             
            },
            onClearFilter: function () {
                var oFilterBar = this.byId("filterbar"),
                    oTable = this.byId("tblFechamentoIFRS17");
                var aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();

                    if (oControl.getId().includes("picker")) {

                        oControl.setValue();
                    } else {
                        oControl.removeAllSelectedItems();
                    }


                    return aResult;
                }, []);

                this.getFechamentoData(aTableFilters);
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
            sendLiberacaoFechamentoIFRS17: function (oObject) {

                oObject.LiberaFechamento = true;
                this.sendRequest(oObject, "LIB_FECHAMENTO");

            },
            onFechamentoItemPress: function (oEvent) {
                var that = this,
                    oSelectedItem = oEvent.getSource(),
                    sDialogName = "",
                    oFechamentoIFRS17Model = this.getModel("fechamentoIFRS17Model"),
                    oContext = oSelectedItem.oBindingContexts,
                    sPath = oContext.fechamentoIFRS17Model.getPath(),
                    oObject = oFechamentoIFRS17Model.getObject(sPath);

                //if (oObject.LiberaFechamento && !oObject.EtapasValidas) {
                    //Somente Visualização
                    sDialogName = "portoseguro.zpstafechifrs17app.view.dialogs.DisplayStepsFechamento";
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
                            model: "fechamentoIFRS17Model"
                        });
                        oDialogDisplay.open();
                    }.bind(this));
                /*} else {
                    //Edição
                    sDialogName = "portoseguro.zpstafechifrs17app.view.dialogs.EditStepsFechamento"
                    if (!this.oDialog) {
                        this.oDialog = Fragment.load({
                            name: sDialogName,
                            controller: this
                        });

                    }
                    this.oDialog.then(function (oDialog) {
                        that.getView().addDependent(oDialog);
                        oDialog.bindElement({
                            path: sPath,
                            model: "fechamentoIFRS17Model"
                        });
                        oDialog.open();
                    }.bind(this));
                }*/




            },
            onCancel: function (oEvent) {
                if (oEvent.getParameter("id") !== "displayCancel") {
                    sap.ui.getCore().byId("editFechamentoDialog").close();
                    sap.ui.getCore().byId("cbStatusPrg").clearSelection();
                    this.onSearch(oEvent);
                } else {
                    sap.ui.getCore().byId("displayFechamentoDialog").close();
                }

            },
            onFechamentoStepSave: function (oEvent) {
                let oDialog = sap.ui.getCore().byId("editFechamentoDialog"),
                    oFechamentoModel = this.getModel("fechamentoIFRS17Model"),
                    oContext = oDialog.mObjectBindingInfos.fechamentoIFRS17Model,
                    oObject = oFechamentoModel.getObject(oContext.path);
                oObject.EtapasValidas = this.enableLiberarFechamento(oObject);
                
                sap.ui.getCore().byId("editFechamentoDialog").close();

                this.sendRequest(oObject, "");

            },
            enableLiberarFechamento: function (oFechamento) {

                let isEnabled = false;

                if (oFechamento) {

                    if (!oFechamento.LiberaFechamento) {
                        
                        //Arquivos Obrigatorios por Empresa
                        if(oFechamento.Bukrs === 'P001'){
                            if (
                                oFechamento.Prg.Statusarq === "1" &&
                                oFechamento.Vec.Statusarq === "1" &&
                                oFechamento.Bca.Statusarq === "1" &&
                                oFechamento.Bcd.Statusarq === "1" &&
                                oFechamento.Tve.Statusarq === "1" &&
                                oFechamento.Rvne.Statusarq === "1"
                            ) {
                                isEnabled = true;
                            }
                        }else{
                            if (
                                oFechamento.Prg.Statusarq === "1" &&
                                oFechamento.Vec.Statusarq === "1" &&
                                oFechamento.Bca.Statusarq === "1" &&                                
                                oFechamento.Tve.Statusarq === "1" &&
                                oFechamento.Rvne.Statusarq === "1"
                            ) {
                                isEnabled = true;
                            }
                        }

                       

                    }

                }

                return isEnabled;

            },
            sendRequest: function (oObject, sAction) {


                //Remove campos somente locais
                delete oObject.Prg.enabled;
                delete oObject.Vec.enabled;
                delete oObject.Tve.enabled;
                delete oObject.Rvne.enabled;
                delete oObject.Bca.enabled;
                delete oObject.Bcd.enabled;
                delete oObject.Juros.enabled;
                delete oObject.Bt.enabled;

                let  oViewModel = this.getModel("fechamentoListView");

                oViewModel.setProperty("/busy",true);


                let oDefaultModel = this.getModel(),
                    that = this,
                    sSuccesMessage = "Etapa Salva com Sucesso!",
                    sErrorMessage = "Ocorreu um erro ao salvar a Etapa.",
                    sPath = "/SteptsFechIFRS17Set";

                if (sAction == "LIB_FECHAMENTO") {
                    sSuccesMessage = "Requisição para Liberar Fechamento IFRS17 salva com Sucesso!";
                    sErrorMessage = "Erro ao Solicitar liberação do Fechamento IFRS17";
                }

                oDefaultModel.create(sPath, oObject, {
                    success: function (oResult) {
                        MessageToast.show(sSuccesMessage);
                        that.onSearch();
                    },
                    error: function (oError) {
                        oViewModel.setProperty("/busy",false);
                        let oJSonErrosResponse = JSON.parse(oError.responseText);
                        let sErrorText = `${sErrorMessage}

                        ERRO:
                            ${oJSonErrosResponse.error.message.value}`;

                        MessageBox.error(sErrorText);    
                        
                    }

                });

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
            onNavToJuros: function(oEvent){

                this.getRouter().navTo("RouteJurosList");
            },
            onShowLogErros: function(oEvent){

                var that = this;
                let sDialogName = "",                 
                    oCtx = oEvent.getSource().oPropagatedProperties.oBindingContexts,
                    oFechamentoModel = this.getModel("fechamentoIFRS17Model"),
                    oSelectedItem = oFechamentoModel.getObject(oCtx.fechamentoIFRS17Model.getPath());
                    
                  
                    switch (oEvent.getParameter("id")) {
                        case "btnRvneShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'RVN';
                            break;                   
                        case "btnTveShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'RCR';
                            break;                   
                        case "btnPrgShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'PRG';
                            break;                   
                        case "btnVecShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'VEC';
                            break;   
                        case "btnBcaShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'BCA';
                            break;                                 
                        case "btnBcdShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'BCD';
                            break;                     
                        case "btnJurosShowLogError":
                            oSelectedItem.TipoProcessoFilter = 'JUROS';
                            break;                   
                    }



                that.selectedItemFilter = oSelectedItem;    

          
                sDialogName = "portoseguro.zpstafechifrs17app.view.dialogs.DisplayLogErrosFechamento";
                if (!this.oDialogDisplayLogErros) {
                    this.oDialogDisplayLogErros = Fragment.load({
                        name: sDialogName,
                        controller: this
                    });

                }
                this.oDialogDisplayLogErros.then(function (oDialogDisplayLogErros) {
                    that.getView().addDependent(oDialogDisplayLogErros);
                    
                    let aFilters = [new Filter({
                        path: 'Ano',
                        operator: FilterOperator.EQ,
                        value1: that.selectedItemFilter.Ano
                    }),
                    new Filter({
                        path: 'Bukrs',
                        operator: FilterOperator.EQ,
                        value1: that.selectedItemFilter.Bukrs
                    }),
                    new Filter({
                        path: 'Mes',
                        operator: FilterOperator.EQ,
                        value1: that.selectedItemFilter.Mes
                    }),
                    new Filter({
                        path: 'Tipoprocesso',
                        operator: FilterOperator.EQ,
                        value1: oSelectedItem.TipoProcessoFilter
                    })];
                    sap.ui.getCore().byId("tblLogErros").getBinding("rows").filter(aFilters);


                    oDialogDisplayLogErros.open();
                }.bind(this));

            },
            onCloseLogDialog: function (oEvent) {                           
                sap.ui.getCore().byId("displayLogErrosFechamento").close();
            },
            createColumnConfig: function() {
                var aCols = [];
                
                aCols.push({label: 'Empresa', property: 'Bukrs'});
                aCols.push({label: 'Ano', property: 'Ano'});
                aCols.push({label: 'Mes', property: 'Mes'});
                aCols.push({label: 'Dataproc', property: 'Dataproc', type: 'date'});
                aCols.push({label: 'Horaproc', property: 'Horaproc', type: sap.ui.export.EdmType.Time});
                aCols.push({label: 'Tipoprocesso', property: 'Tipoprocesso'});
                aCols.push({label: 'Linha Arq', property: 'Numlinhaarq'});
                aCols.push({label: 'Nome Arq', property: 'Nomearquivo'});
                aCols.push({label: 'Erro desc', property: 'Erro'});
    
                return aCols;
            },
    
            
            onExportLog: function() {
                var aCols, oSettings, oSheet;

    
                var oTable = sap.ui.getCore().byId("tblLogErros");
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