(function(window, angular) {
  'use strict';

  angular.module('ngSimpleGrid', ['ng']).directive('simpleGrid', ['$compile', function($compile) {

    'ngInject';

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        ngDataList: '=ngDataList',
        ngDataClick: '=ngDataClick',
        ngDataPagination: '=ngDataPagination',
        ngDataPaginationEnabled: '=ngDataPaginationEnabled',
        ngDataPaginationEvents: '=ngDataPaginationEvents',
        ngDataLength: '@ngDataLength',
        ngDataSingleOrdering: '@ngDataSingleOrdering',
        ngDataDefaultLength: '=ngDataDefaultLength',
        ngDataLoading: '=ngDataLoading',
        ngDataEmptyIcon: '@ngDataEmptyIcon',
        ngDataEmptyText: '@ngDataEmptyText',
        $ctrl: '=ngDataCtrl'
      },
      template: '<ng-transclude></ng-transclude>',
      link: function($scope, elmt) {

        var Pagination = function(dataLength, fnEvent) {
          var _len = (dataLength ?
                      dataLength.split(',') :
                      ($scope.ngDataList ? $scope.ngDataList.length : 0));

          var length = [].map.call(_len, function(line) {
            return {value: line.trim(), label: line.trim()};
          });

          this.fnEvent = fnEvent;
          this.length = length;
          this.selectLength = length && length.length > 0 ?
                              length[0].value:
                              ($scope.ngDataList ? $scope.ngDataList.length : 0);
          this.selectLength = $scope.ngDataDefaultLength && !Number.isNaN($scope.ngDataDefaultLength) ?
            $scope.ngDataDefaultLength : this.selectLength;
          this.page = 0;
          this.sortableMap = {};
        };

        Pagination.prototype = {

          /**
           * [Previous]
           */
          previous: function() {
            this.page--;
            this.runFnEvent('previous');
            $scope.$ctrl.previous();
          },

          /**
           * [Next]
           */
          next: function() {
            this.page++;
            this.runFnEvent('next');
            $scope.$ctrl.next();
          },

          /**
           * [Run Fn Event]
           */
          runFnEvent: function(event) {
            var sortableMap = {};
            for (var key in this.sortableMap) {
              sortableMap[this.getCamelCase(key)] = this.sortableMap[key] ? 'desc' : 'asc';
            }
            this.fnEvent = {
              status: event,
              page: this.page,
              length: this.selectLength,
              sortableMap: sortableMap
            };
          },

          /**
           * [setSelectLength]
           */
          setSelectLength: function() {
            this.page = 0;
            this.runFnEvent('change-length');
            $scope.$ctrl.changePageSize(this.fnEvent.length);
          },

          /**
           * To Camel Case
           * @param  {[String]} str
           * @return {[String]}
           */
          getCamelCase: function(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
              return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
          },

          /**
           * [sort]
           * @param  {[type]} column [description]
           * @return {[type]}        [description]
           */
          sortable: function(column) {
            if ($scope.ngDataSingleOrdering === 'true') {
              var statusTmp = {name: column, value: this.sortableMap[column]};
              this.sortableMap = {};
              this.sortableMap[statusTmp.name] = statusTmp.value;
            }
            if (this.sortableMap[column] === false) {
              delete this.sortableMap[column];
            } else {
              this.sortableMap[column] = this.sortableMap[column] === undefined ? true : !this.sortableMap[column];
            }
            this.runFnEvent('sortable');
          }
        };

        var $this = {

          /**
           * Main method
           * @return {[type]} [description]
           */
          main: function() {
            $this.init(function() {
              $this.load($this.addEventListeners);
            });
          },

          /**
           * Init method
           * @param Function
           * @return
           */
          init: function(callback) {
            $scope.pagination = new Pagination($scope.ngDataLength, $scope.ngDataPaginationEvents);
            callback && callback();
          },

          /**
           * Load method
           * @param Function
           * @return
           */
          load: function(callback) {
            $this.setTemplate();
            callback && callback();
          },

          /**
           * Add EventListeners method
           * @param
           * @return
           */
          addEventListeners: function() {
            $scope.getStatusSortable = $this.getStatusSortable.bind($this);
          },

          /**
           * Render method
           * @param  {[type]} template [description]
           * @return {[type]}          [description]
           */
          render: function(template) {
            $compile(elmt.html(template).contents())($scope);
          },

          /**
           * Get Status Sortable
           * @param  {[String]} columnName
           * @return {[String]}
           */
          getStatusSortable: function(columnName) {
            if ($scope.pagination.sortableMap.hasOwnProperty(columnName)) {
              return $scope.pagination.sortableMap[columnName] ? 'arrow_drop_down' : 'arrow_drop_up';
            }
          },

          /**
           * Get columns header
           * @return {[String]} [Template Header]
           */
          getColumnsHeader: function() {
            return [].map.call(elmt[0].querySelectorAll('header column'), function(data) {
              var sortable = '<md-icon>{{getStatusSortable(\'' + data.innerHTML + '\')}}</md-icon>';
              var column = '';
              column += '<th' + JSON.stringify(data.dataset).replace(/{"/gi, '').replace(/":/gi, '=').replace(/}/gi, ' ') + '>';
              column += data.dataset.sortable ? '<div ng-click="pagination.sortable(\'' + data.innerHTML + '\')"><md-icon>sort</md-icon>' + data.innerHTML + sortable + '</div>' : data.innerHTML;
              column += '</th>';
              return column;
            }).join('');
          },

          /**
           * Get columns body
           * @return {[String]} [Template Header]
           */
          getColumnsBody: function() {
            var line = '';
            line += '<tr id="row{{$index}}" class="clickable" md-select="item" aria-disabled="false" ng-repeat="$line in ngDataList" ng-if="!$line.deleted">';
            line += [].map.call(elmt[0].querySelectorAll('list column'), function(data) {
              var filter = data.dataset.filter ? ' | ' + data.dataset.filter : '';
              var column = '<td id="row{{$index}}.' + data.dataset.bind + '"role="button" tabindex="0"' + (!data.dataset.disabledClick ? 'ng-click="ngDataClick($index, $line)"' : '') + '>';
              column += data.dataset.bind ? '<abbr title="{{$line.' + data.dataset.bind + filter + '}}">{{$line.' + data.dataset.bind + filter + '}}</abbr>' : data.innerHTML;
              column += '</td>';
              return column;
            }).join('');
            line += '</tr>';
            return line;
          },

          /**
           * Set template
           * @return {[type]} [description]
           */
          setTemplate: function() {
            var template = '';
            template += '<table id="simple-grid-table" class="simple-grid" ng-show="ngDataLoading || ngDataList.length" multiple="true" aria-invalid="false">';
            template += '  <thead id="simple-grid-header">';
            template += '    <tr>';
            template += '      ' + $this.getColumnsHeader();
            template += '    </tr>';
            template += '  </thead>';
            template += '  <thead class="table-progress">';
            template += '    <tr>';
            template += '      <th colspan="' + elmt[0].querySelectorAll('header column').length + '">';
            template += '        <md-progress-linear md-mode="indeterminate" ng-show="ngDataLoading"></md-progress-linear>';
            template += '      </th>';
            template += '    </tr>';
            template += '  </thead>';
            template += '  <tbody>';
            template += '    ' + $this.getColumnsBody();
            template += '  </tbody>';
            template += '</table>';

            template += '<div class="simple-grid-pagination" layout="row" layout-align="end center" aria-hidden="false" ng-if="ngDataPagination" ng-show="ngDataLoading || ngDataList.length">';
            template += '  <div class="limit-select" layout="row" layout-align="center center">';
            template += '    <p class="label">Rows per page:</p>';
            template += '    <md-select id="pages-select" aria-label="rows per page selection" ng-model="pagination.selectLength" ng-change="pagination.setSelectLength()">';
            template += '      <md-option id="opt{{$index}}" ng-repeat="opt in pagination.length" ng-value="opt.value">';
            template += '        {{opt.label}}';
            template += '      </md-option>';
            template += '    </md-select>';
            template += '  </div>';
            template += '  <div class="buttons">';
            template += '    <button id="previous-page" class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Previous" ng-click="pagination.previous()" ng-disabled="!pagination.page">';
            template += '      <md-icon>keyboard_arrow_left</md-icon>';
            template += '    </button>';
            template += '    <button id="next-page" class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Next" ng-click="pagination.next()" ng-disabled="!ngDataPaginationEnabled()">';
            template += '      <md-icon>keyboard_arrow_right</md-icon>';
            template += '    </button>';
            template += '  </div>';
            template += '</div>';
            
            template += '<div class="md-no-results" layout="column" layout-align="center center" ng-show="!ngDataLoading && !ngDataList.length">';
            template += '  <md-icon class="material-icons">{{ngDataEmptyIcon}}</md-icon>';
            template += '  <p class="md-body-1">{{ngDataEmptyText}}</p>';
            template += '</div>';
            $this.render(template);
          }
        };

        $this.main();
      }
    };
  }]);
})(window, window.angular);
