'use strict';

angular.module('stockAppApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
   $scope.awesomeThings = {
    close: [],
    date: [],
    symbol: "",
    };

  $scope.stocks = [{
    name: "AAPL",
  }];
  $scope.newStock = ""
  $scope.labels = [];
  $scope.series = [];
  $scope.data = [
  ];


    function reset(){
      $scope.labels = [];
      $scope.series = [];
      $scope.data = [];
    };


    function getStocks() {
    $scope.stocks.forEach(function(stock){
        $http.get('/api/things/stocks/' + stock.name).success(function(awesomeThings) {
          var stockNums =  [];
          var stockDates = [];
          var name = "";
          awesomeThings.forEach(function(thing){
             stockNums.push(thing.close);
             stockDates.push(thing.date.substr(0,10));
             name = thing.symbol;
          });
          $scope.data.push(stockNums);
          $scope.labels = stockDates;
          $scope.series.push(name);
        });
 
    });
    };

    function loadStocks(){
    $http.get('/api/things').success(function(stock) {
      $scope.stocks = stock;
      getStocks();
      socket.syncUpdates('stock', $scope.stocks);
    });
    };

    loadStocks();

    $scope.addThing = function(thing) {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      socket.syncUpdates('thing', $scope.stocks);
      socket.syncUpdates('thing', $scope.series);
      $scope.newThing = '';
      reset();
      loadStocks();
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
      socket.syncUpdates('thing', $scope.stocks);
      socket.syncUpdates('thing', $scope.series);
      reset();
      loadStocks();
    };
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
      
    });
  });
