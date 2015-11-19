'use strict';

const navigation = require('../utils/navigation');

module.exports = ($scope,dataService) => {
	let errorType = dataService.get('errorType') || "Unknown error type";
	let errorMessage = dataService.get('errorMessage') || "Try again";
	console.log('Error type:', errorType, 'Error message:', errorMessage); // jshint ignore:line

	$scope.title = "Hold on... We're suspecting ghouls in the hallway!";
	$scope.message = errorMessage;

	setTimeout(() => {
		navigation.navigate('');
	}, 5000);
};