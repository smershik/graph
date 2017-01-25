"use strict"

function Graph(){
	var nodes = {
		'1': {
			'2':9,
			'3':10,
			'4':7
		},
		'2': {
			'1':9,
			'4':2,
			'3':14,
			'5':15
		},
		'3': {
			'1':10,
			'2':14,
			'4':21
		},
		'4': {
			'1':7,
			'2':2,
			'3':21
		},
		'5': {
			'2':15
		}
	};

	var routes;

	var searchRoutes = function (startNode,finishNode,openNodes = []) {
		openNodes.push(+startNode);
		if(nodes[startNode][finishNode]!==undefined){
			openNodes.push(+finishNode);
			var distance = 0;
			for(var i=0;i<openNodes.length-1; i++){
				distance+=nodes[openNodes[i]][openNodes[i+1]];
			}
			routes.push({dist:distance,route:openNodes});
		} else {
			for(var i in nodes[startNode]){
				if(openNodes.indexOf(+i, 0)==-1) {
					searchRoutes(i,finishNode,openNodes.slice(0, openNodes.length+1));
				}
			}
		}
	};

	this.searchMinRoute = function(startNode,finishNode){
		if (nodes[startNode]==undefined||nodes[finishNode]==undefined) return 'not existing node';
		if (startNode==finishNode) return 0;
		routes = [];
		searchRoutes(startNode,finishNode);
		var minDistance = routes[0].dist;
		var result = routes[0];
		for(var i = 0; i<routes.length; i++){
			if(routes[i].dist<minDistance){
				minDistance = routes[i].dist;
				result = routes[i];
			}
		}
		return result;
	};

	this.addNode = function(name, links){
		nodes[name] = links;
		for(var i in nodes[name]){
			nodes[i][name] = links[i];
		}
	}

	this.removeNode = function(name){
		delete nodes[name];
		for(var i in nodes){
			if (nodes[i][name]!==undefined) delete nodes[i][name];
		}
		console.log(nodes);
	}

	this.nodesAdapter = function(){
		var result = [];
		for (var i in nodes){
			result.push({id: +i,label:'Node '+i});
		}
		return result;
	}

	this.edgesAdapter = function(){
		var result = [];
		for (var links in nodes){
			for (var i in nodes[links]){
				var check = false; 
				result.forEach( function(item) {
					if(item['from']==i&&item['to']==links) check = true;
				});
				if(!check)
					result.push({id:(links + i),from: +links, to: +i, label: nodes[links][i],font:{align: 'middle'}});
			}
		}
		return result;
	}
	
	}


// var startNodeId;
		

	var g = new Graph();
	var nodes =new vis.DataSet(g.nodesAdapter());
	var edges = new vis.DataSet(g.edgesAdapter());
	var container = document.getElementById('mynetwork');
	var data = {
	  nodes: nodes,
	  edges: edges
	  };
	var options = {
	};
	var network = new vis.Network(container, data, options);


document.getElementById('routeButton').onclick = function(){
	var startNode = document.getElementById('startNode').value;
	var finishNode = document.getElementById('finishNode').value;
	var routeNodes = g.searchMinRoute(startNode,finishNode).route;
	var routeEdges = function (routeNodes) {
		var result= [];
		for(var i =0; i<routeNodes.length-1; i++){
			if(routeNodes[i]<routeNodes[i+1]){
				result.push(routeNodes[i] +''+ routeNodes[i+1]);
			}else{
				result.push(routeNodes[i+1] +''+ routeNodes[i]);
			}
		}
		return result;
	}
	console.log(routeEdges(routeNodes));
	network.setSelection({
		nodes:routeNodes,
		edges:routeEdges(routeNodes)
	},{
		highlightEdges:false
	});
}



