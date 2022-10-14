sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/core/UIComponent"
    ],
    function (Controller, History, UIComponent) {
      "use strict";
  
      return Controller.extend(
        "portoseguro.zpstafechifrs17app.controller.BaseController",
        {
          
  
          getModel: function (sName) {
            return (
              this.getView().getModel(sName) ||
              this.getOwnerComponent().getModel(sName)
            );
          },
  
          setModel: function (oModel, sName) {
            this.getView().setModel(oModel, sName);
          },
  
          getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
          },
  
          getRouter: function () {
            return UIComponent.getRouterFor(this);
          },
  
          onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
  
            if (sPreviousHash !== undefined) {
              window.history.back();
            } else {
              this.getRouter().navTo("appHome", {});
            }
          },
  
          closeAndDestroy: function (oEvent) {
            var oSource = oEvent && oEvent.getSource();
            if (!oSource) {
              return;
            }
            oSource.close();
            oSource.destroy();
          },
        }
      );
    }
  );
  