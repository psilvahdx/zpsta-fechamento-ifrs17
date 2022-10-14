/*global QUnit*/

sap.ui.define([
	"portoseguro/zpsta_fechifrs17_app/controller/FechamentoList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FechamentoList Controller");

	QUnit.test("I should test the FechamentoList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
