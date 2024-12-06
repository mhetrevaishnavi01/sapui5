/*global QUnit*/

sap.ui.define([
	"comsalesoder/salesorderpractice/controller/Salesorder.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Salesorder Controller");

	QUnit.test("I should test the Salesorder controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
