sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function(DateFormat) {
    'use strict';

    var _oResourceBundle = null;

    return{
        
        
        setResourceBundle: function (oResourceBundle) {
            _oResourceBundle = oResourceBundle;
        },
        formatStatusFechamento: function(sStatus){

            switch (sStatus) {
                case "5":
                    return "Information";
                case "1":
                    return "Success";
                case "2":
                    return "Error";    
                case "3":
                    return "Error"
                default:
                    return "None";  
            }
        },
        formatStatusTextFechamento: function(sStatus){

            switch (sStatus) {
                case "5":
                    return _oResourceBundle.getText("para_validar_txt");
                case "1":
                    return _oResourceBundle.getText("valido_txt");                    
                case "2":
                    return _oResourceBundle.getText("invalido_txt");                    
                case "3":
                    return _oResourceBundle.getText("invalidado_txt");                    
                case "999":
                    return _oResourceBundle.getText("sem_arquivo_txt");                    
            }
        },
        formatStatusIconFechamento:  function(sStatus){

            switch (sStatus) {
                case "5":
                    return "sap-icon://order-status";
                case "1":
                    return "sap-icon://accept";
                case "2":
                    return "sap-icon://decline";    
                case "3":
                    return "sap-icon://alert";  
                case "999":
                    return "sap-icon://less"; 
            }
        },
        getListEnabledStatusByStatus: function(oStatus){
            let bResult = false;

            switch (oStatus) {
                case "1":
                    bResult = true
                    break;
                case "3":    
                    bResult = true
                    break;            
                default:                    
                    bResult = false
                    break;
            }         

            return bResult;
        },

        formatDate : function (dDate) {
			if (dDate == null){ return "";}
			
            var oDateFormat = DateFormat.getDateTimeInstance({
                pattern: "dd/MM/yyyy"
            });
            
            return oDateFormat.format(new Date(dDate), true);
		},
		
		formatTime : function (oTime) {
			if (oTime === null){ return "";}
			
			    var timeString = new Date(oTime.ms).toUTCString();

                var oTimeFormat = DateFormat.getDateTimeInstance({
                    pattern: "hh:mm:ss"
                });


			
			return oTimeFormat.format(new Date(timeString), true);
		}

    };
});