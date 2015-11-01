/* jshint browser:true */
'use strict';

const dataService = require('../services/dataService');

module.exports = ($scope,dataService) => {
	let errorMessage = dataService.get('error') || "Try again";

	$scope.title="Hold on... We're suspecting ghouls in the hallway!";
	$scope.message=errorMessage;
};