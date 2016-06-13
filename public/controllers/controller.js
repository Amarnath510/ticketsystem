var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider) {
	$routeProvider

		.when('/logticket', {
			templateUrl : 'partials/logticket.html',
			controller: 'LogTicketCtrl'
		})

		.when('/viewalltickets', {
			templateUrl : 'partials/viewAll.html',
			controller: 'ViewAllCtrl'
		})

		.when('/addcomment', {
			templateUrl : 'partials/searchTicket.html',
			controller : 'MainCtrl'
		})

		.when('/assignto', {
			templateUrl : 'partials/searchTicket.html',
			controller : 'MainCtrl'
		})

		.when('/changestatus', {
			templateUrl : 'partials/searchTicket.html',
			controller : 'MainCtrl'
		})

		.when('/viewticket', {
			templateUrl : 'partials/viewticket.html',
			controller : 'viewCtrl'
		})		

		.otherwise({ redirectTo: '/logticket' });
});

myApp.controller('MainCtrl', ['$scope', '$http', '$location', 'DataSrv', function($scope, $http, $location, DataSrv) {
	// console.log('Hello World');

	$scope.isActive = function(destination) {
   		return destination === $location.path();	
	}

	$scope.gotoUrl = function(url) {
		$location.url(url);
	}

	// console.log($location.path());
	var record = new Object();
	record.id = 'Select';
	$scope.record = record;
	var ids = [];
	$http.get('/ticketsystem').success(function(response) {
		for(i = 0; i < response.length; i++) {
			ids.push(response[i]._id)
		}

		$scope.ids = ids;
	});

	$scope.selectDropDown = function(id, record) {
		record.id = id;
	}

	$scope.searchTicketByMenu = function(id) {
		// console.log(id);
		if(id === undefined || id == null || id === 'Select') {
			return;
		} else {
			// getRecord(id);
			DataSrv.setRecordId(id);
			$location.url('/viewticket');
		}
	}

}]);


myApp.controller('LogTicketCtrl', ['$scope', '$http', function($scope, $http) {
	var record = new Object();
	record.cusName = '';
	record.comment = '';
	record.allcomments = [];
	record.createdBy = 'Select';
	record.assignTo = 'Select';
	record.status = 'Select';
	$scope.record = record;

	$http.get('/createdItems').success(function(response) {
		$scope.createByItems = response;		
	});

	$http.get('/assignItems').success(function(response) {
		$scope.assignToItems = response;		
	});


	$http.get('/statusItems').success(function(response) {
		$scope.statusItems = response;		
	});

	$scope.reset = function() {
		$scope.record.cusName = "";	
		$scope.record.comment = "";	
		$scope.record.createdBy = "Select";	
		$scope.record.assignTo = "Select";	
		$scope.record.status = "Select";
		$scope.showMsg = false;	
	}

	$scope.selectDropDown = function(item, record, type) {
		hideMessage();
		if(type === "createdBy") {
			$scope.record.createdBy = item;
		} else if(type === "assignTo") {
			$scope.record.assignTo = item;

			if(item != 'Select') {
				$scope.record.status = 'Closed';	
				showMessage('Once Ticket is assigned, status becomes closed and you cannot edit this ticket later.');
			}
		} else if(type === "status") {
			$scope.record.status = item;

			if(item == 'Closed' && $scope.record.assignTo === 'Select') {
				$scope.record.status = 'New';
				showMessage('A ticket cannot be closed without assigning to someone.');
			} else if(item == 'New' || item == 'Open') {
				if($scope.record.assignTo != 'Select') {
					showMessage('A Open Ticket cannot have assign to.');
				}
				$scope.record.assignTo = 'Select';
			}
		}
	}

	function showMessage(msg) {
		$scope.statusMessage = msg;
		$scope.showMsg = true;
	}

	function hideMessage() {
		$scope.showMsg = false;
	}

	$scope.save = function() {
		if(validate($scope.record)) {
			console.log($scope.record);
			$scope.record.allcomments.push($scope.record.comment);

			$http.post('/ticketsystem', $scope.record).success(function(response) {
				var str1 = 'Success: Ticket is Saved successfully with id = ';
				var str2 = response._id;
				var str3 = str1.concat(str2)
				showMessage(str3);
			});		
		}
	};

	function validate(record) {
		if(record.cusName.trim().length == 0) {
			showMessage("Please enter a valid cutomer name.");
			return false;
		} else if(record.cusName.trim().length > 30) {
			showMessage("Customer Name should be maximum 30 characters");
			return false;
		} else if(record.comment.trim().length == 0) {
			showMessage("Please enter a valid comment.");
			return false;
		} else if (record.comment.trim().length > 500) {
			showMessage("Comment should be maximum 30 characters");
			return false;
		} else if(record.createdBy === 'Select') {
			showMessage("Please select created by");
			return false;
		} else {
			return true;
		}
	}

}]);


myApp.controller('ViewAllCtrl', ['$scope', '$http', '$location', 'DataSrv', function($scope, $http, $location, DataSrv) {
	$http.get('/ticketsystem').success(function(response) {
		$scope.records = response;
	});

	$scope.openInView = function(id) {
		DataSrv.setRecordId(id);
		$location.url('viewticket');
	};

}]);

myApp.service('DataSrv', function() {
	var currRecordId = "";
	this.getRecordId = function() {
		return currRecordId;
	}

	this.setRecordId = function(id) {
		currRecordId = id;
		return currRecordId;
	}

	var header = 'View Ticket';
	this.getHeader = function() {
		return header;
	}

	this.setHeader = function(head) {
		header = head;
	}

	this.getCurrentView = function() {
		var tempHeader = this.getHeader();
		if(tempHeader === 'Add Comment') {
			return 'AddComment';
		} else if(tempHeader === 'Change Assign To') {
			return 'AssignTo';
		} else if(tempHeader === 'Change Status') {
			return 'ChangeStatus';
		} 
	}

});


myApp.controller('viewCtrl', ['$scope', '$http', 'DataSrv', function($scope, $http, DataSrv) {
	$http.get('/createdItems').success(function(response) {
		$scope.createByItems = response;		
	});

	$http.get('/assignItems').success(function(response) {
		$scope.assignToItems = response;		
	});

	$http.get('/statusItems').success(function(response) {
		$scope.statusItems = response;		
	});

	$scope.header = DataSrv.getHeader();

	var copy;
	var id = DataSrv.getRecordId();
	$http.get('/ticketsystem/' + id).success(function(response) {
		$scope.record = response;

		$scope.record.comment = "";

		if($scope.record.assignTo == undefined) {
			$scope.record.assignTo = 'Select';
		}

		if($scope.record.status == undefined) {
			$scope.record.status = 'Select';
		}

		copy = angular.copy($scope.record);
	});

	$scope.selectDropDown = function(item, record, type) {
		hideMessage();
		if(type === "createdBy") {
			$scope.record.createdBy = item;
		} else if(type === "assignTo") {
			$scope.record.assignTo = item;

			if(item != 'Select') {
				$scope.record.status = 'Closed';	
				showMessage('Once Ticket is assigned, status becomes closed and you cannot edit this ticket later.');
			}
		} else if(type === "status") {
			$scope.record.status = item;

			if(item == 'Closed' && $scope.record.assignTo === 'Select') {
				$scope.record.status = 'New';
				showMessage('A ticket cannot be closed without assigning to someone.');
			} else if(item == 'New' || item == 'Open') {
				if($scope.record.assignTo != 'Select') {
					showMessage('A Open Ticket cannot have assign to.');
				}
				$scope.record.assignTo = 'Select';
			}
		}
	}

	function showMessage(msg) {
		$scope.statusMessage = msg;
		$scope.showMsg = true;
	}

	function hideMessage() {
		$scope.showMsg = false;
	}

	$scope.update = function(data) {
		if(copy != undefined) {
			if(copy.status == 'Closed') {
				showMessage('You cannot update. This ticket is closed.');
				return;
			} else {
				if($scope.record.comment.trim().length > 0) {
					$scope.record.allcomments.push($scope.record.comment.trim());
				}
			}

			console.log($scope.record);
			$http.put('/ticketsystem/' + $scope.record._id, $scope.record).success(function(response) {
				$scope.record = response;
			});	
			showMessage('This ticket is updated successfully.');
		} 
	}
}]);