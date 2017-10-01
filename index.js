var moduleName = 'ngSimpleGrid';

angular.module(moduleName, ['ng']).directive('simpleGrid', function($compile) {

  'ngInject';

  return {
    restrict: 'E',
    scope: {
      ngDataList: '=ngDataList',
      ngDataClick: '=ngDataClick',
      ngDataPagination: '=ngDataPagination',
      ngDataPaginationEnabled: '=ngDataPaginationEnabled',
      ngDataPaginationEvents: '=ngDataPaginationEvents',
      ngDataLength: '@ngDataLength',
      ngDataSingleOrdering: '@ngDataSingleOrdering',
      $ctrl: '=ngDataCtrl'
    },
    link: function($scope, elmt) {

      var Pagination = function(dataLength, fnEvent) {
        var length = [].map.call((dataLength ? dataLength.split(',') : []), function(line) {
          return {value: line.trim(), label: line.trim()};
        });

        this.fnEvent = fnEvent;
        this.length = length;
        this.selectLength = length[0].value;
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
        },

        /**
         * [Next]
         */
        next: function() {
          this.page++;
          this.runFnEvent('next');
        },

        /**
         * [Run Fn Event]
         */
        runFnEvent: function(event) {
          var sortableMap = {};
          for (var key in this.sortableMap) {
            sortableMap[this.getCamelCase(key)] = this.sortableMap[key] ? 'desc' : 'asc';
          }
          this.fnEvent({
            status: event,
            page: this.page,
            length: this.selectLength,
            sortableMap: sortableMap
          });
        },

        /**
         * [setSelectLength]
         */
        setSelectLength: function() {
          this.runFnEvent('change-length');
        },

        /**
         * To Camel Case
         * @param  {[String]} str
         * @return {[String]}
         */
        getCamelCase(str) {
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
            column += '<th md-column class="md-column ng-scope ng-isolate-scope" ' + JSON.stringify(data.dataset).replace(/{"/gi, '').replace(/":/gi, '=').replace(/}/gi, ' ') + '>';
            column += data.dataset.sortable ? '<div style="cursor: pointer;" ng-click="pagination.sortable(\'' + data.innerHTML + '\')"><md-icon>sort</md-icon>' + data.innerHTML + sortable + '</div>' : data.innerHTML;
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
          line += '<tr md-row md-select="item" class="md-row ng-scope ng-isolate-scope md-clickable" aria-disabled="false" ng-repeat="$line in ngDataList">';
          line += [].map.call(elmt[0].querySelectorAll('list column'), function(data) {
            var column = '<td md-cell class="md-cell ng-scope md-clickable" role="button" tabindex="0" ' + (!data.dataset.disabledClick ? 'ng-click="ngDataClick($index, $line)"' : '') + '>';
            column += data.dataset.bind ? '{{$line.' + data.dataset.bind + '}}' : data.innerHTML;
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
          template += '<table class="md-data-table ng-pristine ng-untouched ng-valid md-table ng-isolate-scope ng-not-empty" md-table md-progress="false" multiple="true" aria-invalid="false">';
          template += '  <thead ng-show="true" md-head class="md-head ng-isolate-scope">';
          template += '    <tr md-row class="md-row">';
          template += '      ' + $this.getColumnsHeader();
          template += '    </tr>';
          template += '  </thead>';
          template += '  <tbody md-body class="md-body">';
          template += '    ' + $this.getColumnsBody();
          template += '  </tbody>';
          template += '</table>';

          template += '<div class="ng-scope md-table-pagination ng-isolate-scope" aria-hidden="false" style="" ng-if="ngDataPagination">';
          template += '  <div class="limit-select ng-scope">';
          template += '    <div class="label ng-binding">Rows per page:</div>';
          template += '    <md-select class="md-table-select" ng-model="pagination.selectLength" ng-change="pagination.setSelectLength()">';
          template += '      <md-option ng-repeat="opt in pagination.length" ng-value="opt.value">';
          template += '        {{opt.label}}';
          template += '      </md-option>';
          template += '    </md-select>';
          template += '  </div>';
          template += '  <div class="buttons">';
          template += '    <div class="label ng-binding">1 - 25 of 26</div>';
          template += '    <button class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Previous" ng-click="pagination.previous()" ng-disabled="!pagination.page">';
          template += '      <md-icon md-svg-icon="navigate-before.svg" class="ng-scope" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></md-icon>';
          template += '    </button>';
          template += '    <button class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Next" ng-click="pagination.next()" ng-disabled="!ngDataPaginationEnabled()">';
          template += '      <md-icon md-svg-icon="navigate-next.svg" class="ng-scope" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></md-icon>';
          template += '    </button>';
          template += '  </div>';
          template += '</div>';
          $this.render(template);
        }
      };

      $this.main();
    }
  };
});

module.exports = moduleName;
