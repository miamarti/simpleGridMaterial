(function(window, angular) {

  var handleSticky = function(elmt) {
    var element = elmt.querySelector('.simple-grid-pagination'),
      helper = elmt.querySelector('#sticky-helper');

    if (!element || !helper) {
      return;
    }

    if (elmt.scrollTop + elmt.offsetHeight <= helper.offsetTop + 56) {
      element && element.classList.add('sticky');
      helper && helper.classList.add('sticky-helper');
    } else {
      element && element.classList.remove('sticky');
      helper && helper.classList.remove('sticky-helper');
    }
  };

  angular.module('ngSimpleGrid', ['ng'])

    .directive('scroll', [function() {

      'ngInject';

      return {
        restrict: 'A',
        link: function(scope, elmt) {
          elmt.on('scroll', function() {
            if (elmt[0].querySelector('.simple-grid-pagination')) {
              handleSticky(elmt[0]);
            }
          });
        }
      };
    }])

    .directive('simpleGrid', ['$compile', '$document', '$timeout', function($compile, $document, $timeout) {

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
          ngDataPageReset: '=ngDataPageReset',
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

          $scope.$watch('ngDataList', function() {
            var elmt = $document[0].querySelector('[scroll]');

            $timeout(function() {
              handleSticky(elmt);
            }, 10);
          });

          var Pagination = function(dataLength, fnEvent) {
            var _len = (dataLength ?
              dataLength.split(',') :
              ($scope.ngDataList ? $scope.ngDataList.length : 0));

            var length = [].map.call(_len, function(line) {
              return { value: line.trim(), label: line.trim() };
            });

            this.fnEvent = fnEvent;
            this.length = length;
            this.selectLength = length && length.length > 0 ?
              length[0].value :
              ($scope.ngDataList ? $scope.ngDataList.length : 0);
            this.selectLength = $scope.ngDataDefaultLength && !Number.isNaN($scope.ngDataDefaultLength) ?
              $scope.ngDataDefaultLength : this.selectLength;
            this.page = 0;
            this.sortableMap = {};
          };

          Pagination.prototype = {

            /**
             * Previous
             */
            previous: function() {
              this.page--;
              this.runFnEvent('previous');
              $scope.$ctrl.previous();
            },

            /**
             * Next
             */
            next: function() {
              this.page++;
              this.runFnEvent('next');
              $scope.$ctrl.next();
            },

            /**
             * Reset page
             */
            resetPage: function() {
              this.page = 0;
            },

            /**
             * Run Fn Event
             * @param {string} event
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
             * Set page length
             */
            setSelectLength: function() {
              this.page = 0;
              this.runFnEvent('change-length');
              $scope.$ctrl.changePageSize(this.fnEvent.length);
            },

            /**
             * To Camel Case
             * @param  {string} str
             * @return {string}
             */
            getCamelCase: function(str) {
              return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
              }).replace(/\s+/g, '');
            },

            /**
             * Applies sort to the list based on column
             * @param  {string} column
             */
            sortable: function(column) {
              if ($scope.ngDataSingleOrdering === 'true') {
                var statusTmp = { name: column, value: this.sortableMap[column] };

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
             */
            main: function() {
              $this.init(function() {
                $this.load($this.addEventListeners);
              });
            },

            /**
             * Init method
             * @param {Function} callback
             */
            init: function(callback) {
              if ($scope.ngDataPagination) {
                $scope.pagination = new Pagination($scope.ngDataLength, $scope.ngDataPaginationEvents);
              }
              callback && callback();
            },

            /**
             * Load method
             * @param {Function} callback
             */
            load: function(callback) {
              $this.setTemplate();
              callback && callback();
            },

            /**
             * Add EventListeners method
             */
            addEventListeners: function() {
              $scope.getStatusSortable = $this.getStatusSortable.bind($this);
              if ($scope.ngDataPagination) {
                $scope.ngDataPageReset = $scope.pagination.resetPage.bind($scope.pagination);
              }
            },

            /**
             * Render method
             * @param  {string} template
             */
            render: function(template) {
              $compile(elmt.html(template).contents())($scope);
            },

            /**
             * Get Status Sortable
             * @param  {string} columnName
             * @return {string}
             */
            getStatusSortable: function(columnName) {
              if ($scope.pagination.sortableMap.hasOwnProperty(columnName)) {
                return $scope.pagination.sortableMap[columnName] ? 'arrow_drop_down' : 'arrow_drop_up';
              }
            },

            /**
             * Get columns header
             * @return {string} [Template Header]
             */
            getColumnsHeader: function() {
              return [].map.call(elmt[0].querySelectorAll('header column'), function(data) {
                var sortable = '<md-icon>{{getStatusSortable(\'' + data.innerHTML + '\')}}</md-icon>';
                var column = '';

                column += '<th ' + JSON.stringify(data.dataset).replace(/{"/gi, '').replace(/":/gi, '=').replace(/}/gi, ' ') + '>';
                column += data.dataset.sortable ? '<div ng-click="pagination.sortable(\'' + data.innerHTML + '\')"><md-icon>sort</md-icon>' + data.innerHTML + sortable + '</div>' : data.innerHTML;
                column += '</th>';
                return column;
              }).join('');
            },

            /**
             * Get columns body
             * @return {string} [Template Header]
             */
            getColumnsBody: function() {
              var line = '';

              line += '<tr id="row{{$index}}" class="clickable" md-select="item" aria-disabled="false" ng-repeat="$line in ngDataList" ng-if="!$line.deleted">';
              line += [].map.call(elmt[0].querySelectorAll('list column'), function(data) {
                var filter = data.dataset.filter ? ' | ' + data.dataset.filter : '', column;

                if (data.dataset.bind) {
                  column = '<td id="row{{$index}}.' + data.dataset.bind + ' "role="button" tabindex="0"' + (!data.dataset.disabledClick ? 'ng-click="ngDataClick($index, $line)"' : '') + '>';
                  column += '<abbr title="{{$line.' + data.dataset.bind + filter + '}}">{{$line.' + data.dataset.bind + filter + '}}</abbr>';
                  column += '</td>';
                  return column;
                }
                column = '<td id="row{{$index}}.actions" role="button" tabindex="0"' + (!data.dataset.disabledClick ? 'ng-click="ngDataClick($index, $line)"' : '') + '>';
                column += data.dataset.template ? $scope.$ctrl[data.dataset.template] : data.innerHTML.replace('<!--grid', '').replace('grid-->', '');
                column += '</td>';
                return column;
              }).join('');
              line += '</tr>';
              return line;
            },

            /**
             * Set list template
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

              template += '<div id="sticky-helper"><div>'

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
              template += '    <md-button id="previous-page" class="md-icon-button" aria-label="previous page" ng-click="pagination.previous()" ng-disabled="!pagination.page">';
              template += '      <md-icon>keyboard_arrow_left</md-icon>';
              template += '    </md-button>';
              template += '    <md-button id="next-page" class="md-icon-button" aria-label="next page" ng-click="pagination.next()" ng-disabled="!ngDataPaginationEnabled()">';
              template += '      <md-icon>keyboard_arrow_right</md-icon>';
              template += '    </md-button>';
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
