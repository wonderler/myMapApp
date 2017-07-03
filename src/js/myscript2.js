// mapapp module
// angular-leaflet-directive sample
var app = angular.module("mapapp", ['leaflet-directive'/*, 'ui.sortable'*/]);
	app.controller("mapController", [ "$scope", "$http", "leafletMarkerEvents", 'leafletData', 
        function($scope, $http, leafletMarkerEvents, leafletData) {
        var officePoint = [35.680,139.763];

        $scope.courses = new Array();
        $scope.markers = new Array();
        $scope.paths = new Array();
        $scope.mousePosition;

        // private function
        function markerRefresh(){
            // marker's visible change and paths refresh
            $scope.paths = new Array();
            var points = new Array();

            for (var mrk_i in $scope.markers) {
                if(!$scope.markers[mrk_i].visible){
                    // marker unvisible
                    $scope.markers[mrk_i].icon.className += ' selected1';
                } else {
                    // marker visible
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
                    layer: 'path',
                    latlngs: points
                });
            }
        };

        // office marker push to markers
        function addOfficeMarker(){
            // add office marker to top
            $scope.markers.unshift({
                id: 0000,
                title: "office",
                lat: officePoint[0],
                lng: officePoint[1],
                message: "office",
                visible: true,
                draggable: true,
                layer: 'marker',
                icon: {
                    type: 'div',
                    iconSize: [23, 23],
                    popupAnchor:  [0, 0],
                    html: '<span class="glyphicon glyphicon-xclamation-sign">',
                    className: 'office'
                }
            }); 
        };

        // leaflet mousemove event
        $scope.$on("leafletDirectiveMap.mousemove", function(event, args){
            // update present coordinate
        	var leafEvent = args.leafletEvent;
        	$scope.mousePosition = {
        		lat: leafEvent.latlng.lat,
        		lng: leafEvent.latlng.lng
        	};
        });

        // leaflet mapclick event
        $scope.$on("leafletDirectiveMap.click", function(event, args){
            // nothing
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
            //$scope.center.lat = args.model.lat;
            //$scope.center.lng = args.model.lng;
        });

       	// checkChange event
       	$scope.onCheckChange = function(marker) {
       		markerRefresh();
       	};

        // heatmap coordinate data read.
        $http.get("json/rand-points2.json").success(function(data) {
            $scope.layers.overlays = {
                // heatmap layer
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
                // marker layer
                marker: {
                    name: 'markers',
                    type: 'group',
                    visible: true
                },
                // path layer
                path:{
                    name: 'lines',
                    type: 'group',
                    visible: true
                }
            };
    	});

        // course data read
        $http.get("json/courses2.json").success(function(data){
           $scope.courses = data.courses;
           //var jsonData = window.JSON.parse.parse(data);

           addOfficeMarker();
           // data loop for create marker
           for (var cou_i = 0;cou_i < data.courses.length; cou_i++) {
               var courseCd = data.courses[cou_i].code;
               var count = data.courses[cou_i].count;
               var pathPoints = new Array();

               for(var det_i = 0; det_i < count; det_i++){
                    pathPoints.push({
                        lat: data.courses[cou_i].details[det_i][0],
                        lng: data.courses[cou_i].details[det_i][1]
                    });

                    $scope.markers.push({
                        course: courseCd,
                        id: det_i,
                        title: "data" + det_i,
                        lat: data.courses[cou_i].details[det_i][0],
                        lng: data.courses[cou_i].details[det_i][1],
                        message: "courses" + courseCd + "_order" + det_i,
                        //opacity: 0.9,
                        visible: true,
                        draggable: true,
                        layer: 'marker',
                        icon: {
                            type: 'div',
                            iconSize: [23, 23],
                            popupAnchor:  [0, 0],
                            html: det_i,
                            className: 'red'
                        }
                    });
               }

               // add course path
               $scope.paths.push({
                    type: 'polygon',
                    opacity: .9,
                    weight: 5,
                    fillOpacity: 0,
                    //layer: 'path',
                    latlngs: pathPoints
               });
           }
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
            events: {},
            controls: {
               scale: true
            }
    	});
	}]);