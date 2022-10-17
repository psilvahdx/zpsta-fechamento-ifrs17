sap.ui.define([
        "portoseguro/zpstafechifrs17app/controller/BaseController",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "../model/formatter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Fragment, Filter, FilterOperator, formatter) {
        "use strict";

        return Controller.extend("portoseguro.zpstafechifrs17app.controller.FechamentoList", {
            formatter: formatter,
            onInit: function () {

                this.oResourceBundle = this.getResourceBundle();
                this.formatter.setResourceBundle(this.oResourceBundle);

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

                oDefaultModel.read(sPath,
                    {
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

                        },
                        error: function (oError) {
                            MessageToast.show("Falha ao recuperar dados");
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
                            Acao: false
                        },
                        Vec: {
                            Statusarq: "999",
                            Acao: false
                        },
                        Becf: {
                            Statusarq: "999",
                            Acao: false
                        },
                        Tve: {
                            Statusarq: "999",
                            Acao: false
                        },
                        Juros: {
                            Statusarq: "999",
                            Acao: false
                        },
                        Bt: {
                            Statusarq: "999",
                            Acao: false
                        },
                        LiberaFechamento: false,
                        EtapasValidas: false,

                    };

                    for (let line of ObjMap[fechamentoKey]) {

                        var item = line.element;

                        if (item.Tipoarqproc === 'PRG') {
                            oRow.Prg = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false

                            }
                        }
                        if (item.Tipoarqproc === 'VEC') {
                            oRow.Vec = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false
                            }
                        }
                        if (item.Tipoarqproc === 'BECF') {
                            oRow.Becf = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false
                            }
                        }
                        if (item.Tipoarqproc === 'TVE') {
                            oRow.Tve = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false
                            }
                        }
                        if (item.Tipoarqproc === 'JUROS') {
                            oRow.Juros = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false
                            }
                        }
                        if (item.Tipoarqproc === 'BT') {
                            oRow.Bt = {
                                Statusarq: item.Statusarq === "" ? "5" : item.Statusarq,
                                Acao: item.Acao === "X" ? true : false
                            }
                        }
                        if (item.Tipoarqproc === 'FECHAMENTO') {
                            if(item.Acao === "X"){
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
                /*oTable.getBinding("items").filter(aTableFilters);
                oTable.setShowOverlay(false);*/
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
                    //oCtx = oStateFechamentoControl.getBindingContext(),
                    //oObject = this.getModel().getObject(oCtx.getPath());
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
                                //oFechamentoModel.refresh();
                            } else {
                                oStateFechamentoControl.setState(false);
                                
                            }
                        }
                    });

                }

            },
            sendLiberacaoFechamentoIFRS17: function(oObject){
                
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

                if (oObject.LiberaFechamento && !oObject.EtapasValidas) {
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
                } else {
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
                }




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
                //MessageToast.show(`Registro salvo com sucesso: JSON: ${JSON.stringify(oObject)}`);
                sap.ui.getCore().byId("editFechamentoDialog").close();
                //oFechamentoModel.refresh();

                this.sendRequest(oObject,"");

            },
            enableLiberarFechamento: function (oFechamento) {

                let isEnabled = false;

                if (oFechamento) {

                    if(!oFechamento.LiberaFechamento){
                        if (
                            (oFechamento.Prg.Acao === true && oFechamento.Prg.Statusarq === "1") &&
                            (oFechamento.Vec.Acao === true && oFechamento.Vec.Statusarq === "1") &&
                            (oFechamento.Becf.Acao === true && oFechamento.Becf.Statusarq === "1") &&
                            (oFechamento.Tve.Acao === true && oFechamento.Tve.Statusarq === "1") &&
                            (oFechamento.Juros.Acao === true && oFechamento.Juros.Statusarq === "1") &&
                            (oFechamento.Bt.Acao === true && oFechamento.Bt.Statusarq === "1")
                        ) {
                            isEnabled = true;
                        }
    
                    }
                  
                }

                return isEnabled;

            },
            sendRequest: function (oObject, sAction) {

                let oDefaultModel = this.getModel(),
                    that = this,
                    sSuccesMessage = "Etapa Salva com Sucesso!",
                    sErrorMessage = "Ocorreu um erro ao salvar a Etapa.",
                    sPath = "/SteptsFechIFRS17Set";

                 if(sAction == "LIB_FECHAMENTO") {
                    sSuccesMessage = "Requisição para Liberar Fechamento IFRS17 salva com Sucesso!";
                    sErrorMessage = "Erro ao Solicitar liberação do Fechamento IFRS17";
                 }

                oDefaultModel.create(sPath, oObject, {
                        success: function(oResult){
                            MessageToast.show(sSuccesMessage);
                            that.onSearch();
                        },
                        error: function(oError){
                            MessageBox.error(sErrorMessage);
                            console.log(oError);
                        }

                    });

            }

        });
    });