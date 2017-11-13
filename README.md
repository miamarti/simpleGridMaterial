# See how simple =)
Grid Component for Angular Material


![IMG](https://miamarti.github.io/simpleGridMaterial/app/assets/img.png)


<p>
  <a href="https://gitter.im/miamarti/simpleGridMaterial?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge" target="_blank"><img src="https://badges.gitter.im/Join%20Chat.svg"></a>
  <a href="https://gitlab.com/miamarti/simpleGridMaterial" target="_blank"><img src="https://img.shields.io/badge/gitlab-simpleGridMaterial-yellow.svg"></a>
  <img src="https://img.shields.io/badge/simpleGridMaterial-release-green.svg">
  <img src="https://img.shields.io/badge/version-1.1.8-blue.svg">
  <img src="https://img.shields.io/bower/v/bootstrap.svg">
  <img src="https://img.shields.io/github/license/mashape/apistatus.svg">
  <a href="https://github.com/miamarti/simpleGridMaterial/tarball/master"><img src="https://img.shields.io/github/downloads/atom/atom/latest/total.svg"></a>
  <a href="http://waffle.io/miamarti/simpleGridMaterial"><img alt='Stories in Ready' src='https://badge.waffle.io/miamarti/simpleGridMaterial.svg?label=ready&title=Ready' height="21" /></a>
</p>

[on npm](https://www.npmjs.com/package/simple-grid-material)

### Dependencies
Download make the dependencies of simpleGridMaterial and include in your project
* https://angularjs.org/
* https://material.angularjs.org/latest/

### Installation
```
$ npm install simple-grid-material --save
```

### Module AngularJS include
```
require('angular');

angular.module('Requisition', [
  require('angular-animate'),
  require('angular-material'),
  require('simple-grid-material') //Component Injection
])
```

## Implementation
```
<simple-grid
  ng-data-list="listCtrl.myList"
  ng-data-click="listCtrl.clickPoc"
  ng-data-ctrl="listCtrl"
  ng-data-single-ordering="false"
  ng-data-pagination="true"
  ng-data-length="25, 50, 75, 100, 150, 250"
  ng-data-pagination-enabled="listCtrl.paginationEnabled"
  ng-data-pagination-events="listCtrl.paginationEvents">

  <header>
    <column data-style="width: 14%;" data-sortable="true">Submission date</column>
    <column data-style="width: 14%;" data-sortable="true">Submission ID</column>
    <column data-style="width: 14%;">Submitter</column>
    <column data-style="width: 14%;">Supplier</column>
    <column data-style="width: 14%;" data-sortable="true">Amount</column>
    <column data-style="width: 14%;" data-sortable="true">Requisition number</column>
    <column data-style="width: 14%;"></column>
  </header>

  <list>
    <column data-bind="date"></column>
    <column data-bind="submission_id"></column>
    <column data-bind="submitter"></column>
    <column data-bind="supplier_name"></column>
    <column data-bind="amount"></column>
    <column></column>
    <column data-disabled-click="true">
      <div class="list-action">
        <button ng-click="$ctrl.clickPoc(1)" type="button" aria-label="content_copy">
          <md-icon class="material-icons ng-binding ng-scope">content_copy</md-icon>
        </button>
        <button ng-click="$ctrl.clickPoc(2)" type="button" aria-label="mode_edit">
          <md-icon class="material-icons ng-binding ng-scope">mode_edit</md-icon>
        </button>
      </div>
    </column>
  </list>

</simple-grid>
```

## Parameters

| Name          | Type          | Dinamic | Mandatory | Description                                                  |
| ------------- | ------------- | ------- | --------- | ------------------------------------------------------------ |
| ng-data-list  | Array[Object] | true    | true      | List of objects to be repeated in grid                       |
| ng-data-click | Function      | true    | true      | Function that will be executed when clicking the             |
| ng-data-ctrl  | Object        | true    | true      | Controller that will be transferred to the component's internal context |
| ng-data-single-ordering | Boolean | false | false | When true only allows one field to be sorted at a time         |
| ng-data-pagination      | Boolean | false | false | When true enables paging                                       |
| ng-data-length          | String('25, 50, 75, 100, 150, 250') | false | false | Reports the number of records options |
| ng-data-pagination-enabled | Function | true | true | Function that returns a Boolean allowing pagination to work  |
| ng-data-pagination-events  | Function | true | true | Function that runs whenever you scroll through pagination    |


## Development
Edit `version.js` and run the command below:

```
$ npm run build
```

## Metrics

[![Throughput Graph](https://graphs.waffle.io/miamarti/simpleGridMaterial/throughput.svg)](https://waffle.io/miamarti/simpleGridMaterial/metrics/throughput)
