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
	    	// nothing
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
            // mouse click event is none
        });

        // marker dragend event
        $scope.$on('leafletDirectiveMarker.dragend', function(event, args){
        	// nothing
        });

        $scope.doClick = function() {
        	// nothing
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
                    },
                    path: {
                        name: 'path',
                        type: 'group',
                        data: data
                    }
                };
        });

       	};

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
                    }//, 
                    // cycle: {
                    //     name: 'OpenCycleMap',
                    //     type: 'xyz',
                    //     url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    //     layerOptions: {
                    //         subdomains: ['a', 'b', 'c'],
                    //         attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    //         continuousWorld: true
                    //     }
                    // }
                }, 
                overlays: {
                    heat: {
                        name: 'Heat Map',
                        type: 'heat',
                        layerOptions: {
                            radius: 20,
                            blur: 20
                        },
                        visible: true
                    },
                    marker: {
                        name: 'point',
                        type: 'group',
                        visible: true
                    },
                    path: {
                        name: 'path',
                        type: 'group',
                        visible : false
                    }
                }
            },
            markers :{},
            paths: {},
            events: {},
            controls: {
               scale: true
            }
    	});
	}]);