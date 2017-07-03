var app = angular.module("mapapp", ['leaflet-directive'/*, 'ui.sortable'*/]);
	app.controller("mapController", [ "$scope", "$http", "leafletMarkerEvents", 'leafletData', 
        function($scope, $http, leafletMarkerEvents, leafletData) {
		var points = [];
        var heatmap = {
            name: 'Heat Map',
            type: 'heat',
            data: points,
            visible: true
        };
        var icons = {
        	divIcon: {
	            type: 'div',
	            iconSize: [23, 23],
	            popupAnchor:  [0, 0],
	            //html: 'divIcon',
	            className: 'red'
	        },
	        icon: {
	        	type: 'marker',
	        	className: 'blue'
	        }
	    };

	    function markerRefresh(){
	    	// marker's visible change
       		// paths refresh
       		$scope.paths = new Array();
       		var points = new Array();

       		for (var mrk_i in $scope.markers) {
       			if(!$scope.markers[mrk_i].visible){
       				// marker unvisible
       				//$scope.markers[mrk_i].opacity = .3;
                    $scope.markers[mrk_i].icon.className += ' selected1';
       			} else {
       				// marker visible
       				//$scope.markers[mrk_i].opacity = .9;
                    $scope.markers[mrk_i].icon.className = 'red';
       				// path coordinate add
		            points.push({
        				lat: $scope.markers[mrk_i].lat,
        				lng: $scope.markers[mrk_i].lng
        			});
       			}
       		}
       		// path as polygon
       		if(points.length > 1){
       			$scope.paths.push({
            		type: 'polygon',
            		opacity: .9,
            		weight: 5,
            		fillOpacity: 0,
            		latlngs: points
            	});
       		}
	    };

        $scope.markers = new Array();
        $scope.paths = new Array();
        $scope.mousePosition;
        $scope.courses;

        // leaflet mousemove event
        $scope.$on("leafletDirectiveMap.mousemove", function(event, args){
        	var leafEvent = args.leafletEvent;
        	$scope.mousePosition = {
        		lat: leafEvent.latlng.lat,
        		lng: leafEvent.latlng.lng
        	};
        });

        // leaflet mapclick event
        $scope.$on("leafletDirectiveMap.click", function(event, args){
            var leafEvent = args.leafletEvent;
            var markerId = $scope.markers.length;

            // center to click point 
            //$scope.center.lat = leafEvent.latlng.lat,
            //$scope.center.lng = leafEvent.latlng.lng
            
            // marker add
            $scope.markers.push({
            	id: markerId,
            	title: "click",
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                message: "My Added Marker",
                opacity: 0.9,
                focus: false,
                visible: true,
                draggable: true,
                layer: 'marker',
                icon: {
                    type: 'div',
                    iconSize: [23, 23],
                    popupAnchor:  [0, 0],
                    html: markerId,
                    className: 'red'
                }
            });

            if($scope.markers.length > 2){
            	$scope.paths = new Array();
            	var points = new Array();
            	for(var mrk_i = 0; mrk_i < $scope.markers.length; mrk_i++){
            		if($scope.markers[mrk_i].visible){
            			points.push({
	        				lat: $scope.markers[mrk_i].lat,
	        				lng: $scope.markers[mrk_i].lng
	        			});
            		}
            	}
            	$scope.paths.push({
            		type: 'polygon',
            		opacity: .9,
            		weight: 5,
            		fillOpacity: 0,
            		latlngs: points
            	});
            }
        });

        // marker dragend event
        $scope.$on('leafletDirectiveMarker.dragend', function(event, args){
        	var id = args.model.id;

        	for (var mrk_i = $scope.markers.length - 1; mrk_i >= 0; mrk_i--) {
        		if($scope.markers[mrk_i].id == id){
        			$scope.markers[mrk_i] = args.model;
        		}
        	}
        	markerRefresh();

            // center to dragend point 
            // $scope.center.lat = args.model.lat;
            // $scope.center.lng = args.model.lng;
        });

        $scope.removeMarkers = function() {
        	$scope.markers = new Array();
        	$scope.paths = new Array();
       	};

       	// checkChange event
       	$scope.onCheckChange = function(marker) {
       		markerRefresh();
       	};

        // heatmap coordinate data read.
        $http.get("json/rand-points2.json").success(function(data) {
            $scope.layers.overlays = {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: data,
                    layerOptions: {
                        radius: 40,
                        blur: 20
                    },
                    visible: true
                },
                marker: {
                    name: 'point',
                    type: 'group',
                    data: data, 
                    visible: true
                }
            };
    	});

        $http.get("json/courses2.json").success(function(data){
           $scope.courses = data.courses; 
        });

		angular.extend($scope, {
	        center: {
	        	lat: 35.682,
	            lng: 139.770,
	            zoom: 10
	        },
	        layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                }
            },
            //markers :{},
            //paths: {},
            events: {},
            controls: {
               scale: true
            }
    	});
	}]);