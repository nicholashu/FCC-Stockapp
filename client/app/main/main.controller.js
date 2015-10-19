'use strict';

angular.module('stockAppApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
   $scope.awesomeThings = {
    close: [],
    date: ["2015-09-14T16:00:00.000Z"],
    symbol: "AAPL",
    };

  $scope.labels = [];
  $scope.series = [];
  $scope.data = [
  ];
   

    $scope.getStock = function() {
    $http.get('/api/things/stocks').success(function(awesomeThings) {
      var stockNums =  [];
      var stockDates = [];
      var name = ""
      awesomeThings.forEach(function(thing){
         stockNums.push(thing.close);
         stockDates.push(thing.date.substr(0,10));
         name = thing.symbol

      });
      $scope.data.push(stockNums);
      $scope.labels = stockDates;
      $scope.series = name;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
    };


    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
