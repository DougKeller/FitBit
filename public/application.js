"use strict";angular.module("fitbit.controllers",[]),angular.module("fitbit.services",[]),angular.module("fitbit",["fitbit.controllers","fitbit.services","ui.router"]),angular.module("fitbit").config(["$stateProvider","$urlRouterProvider","States",function(t,e,n){function r(e,n){angular.forEach(e,function(e,o){e.parent=n,e.parent?e.name=n+"."+o:e.name=o,e.templateUrl="templates/"+e.templateUrl,t.state(e.name,e),e.children&&r(e.children,e.name)})}e.otherwise("/"),r(n)}]);var Routes={authorize:"authorize"};angular.module("fitbit").constant("States",function(){var t=function(t){angular.extend(this,t)};return{main:new t({url:"/",controller:"MainController",templateUrl:"testing.html"})}}()),angular.module("fitbit.controllers").controller("MainController",["$scope","$http","$location",function(t,e,n){t.authorize=function(){e.get(Routes.authorize).then(function(t){window.location.href=t.data})}}]);