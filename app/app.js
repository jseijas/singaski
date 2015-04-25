angular.module('skiapp', [])
.controller('MainCtrl', function($scope, FileLoader) {

    $scope.result = 'No map loaded yet. Please click button.'

    $scope.doClick = function() {
        $scope.result = 'Processing map. Please wait...';
        FileLoader.loadFile('assets/map.txt').then(function(data) {
            var map = new SkiMap();
            map.loadFrom(data);
            var winner = map.calculateRoute();
            var route = winner.getRoute();
            var s = route[0].altitude;
            for (var i = 1; i < route.length; i++) {
                s = s+" - "+route[i].altitude;
            }
            $scope.result = s+' altitude delta = '+winner.getTailDistance();
        });
    }

})
.service('FileLoader', function($http) {
    this.loadFile = function(fileName) {
        return $http.get(fileName).then(function (response) {
            console.log(response);
            return response.data;
        });
    }
})


