var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('ticketsystem', ['ticketsystem']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/createdItems', function(req, res) {
	// console.log("Get Create Items.");

	var createItems = ['Tom', 'Tucker', 'Sally'];
	res.json(createItems);
});

app.get('/assignItems', function(req, res) {
	// console.log("Get Assing Items.");

	var assignItems = ['Modi', 'Putin', 'Obama'];
	res.json(assignItems);
});

app.get('/statusItems', function(req, res) {
	// console.log("Get Status Items.");

	var statusItems = ['New', 'Open', 'Closed'];
	res.json(statusItems);
});


app.get('/ticketsystem', function(req, res) {
	// console.log('Get all records.');
	db.ticketsystem.find(function(err, data) {
		// console.log(data);
		res.json(data);
	});
});

app.post('/ticketsystem', function(req, res) {
	// console.log('Post a Record');
	// console.log(req.body);
	db.ticketsystem.insert(req.body, function(err, data) {
		res.json(data);
	});
});


app.get('/ticketsystem/:id', function(req, res) {
	var id = req.params.id;
	// console.log(id);
	db.ticketsystem.findOne({_id : mongojs.ObjectId(id)}, function(err, data) {
		// console.log(data);
		res.json(data);
	});
});


app.put('/ticketsystem/:id', function(req, res) {
	var id = req.params.id;
	// console.log(req.body.allcomments);

	db.ticketsystem.findAndModify({query : {_id : mongojs.ObjectId(id)},
		update : {$set : { assignTo : req.body.assignTo, allcomments : req.body.allcomments, status : req.body.status}},
		new: true}, function(err, data) {
			res.json(data);
		});
});

app.listen(3000);
console.log('Server running on 3000');