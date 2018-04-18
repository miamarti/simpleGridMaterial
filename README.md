# See how simple =)
Grid Component for Angular Material


![IMG](https://miamarti.github.io/simpleGridMaterial/app/assets/img.png)


<p>
  <a href="https://gitter.im/miamarti/simpleGridMaterial?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge" target="_blank"><img src="https://badges.gitter.im/Join%20Chat.svg"></a>
  <a href="https://gitlab.com/miamarti/simpleGridMaterial" target="_blank"><img src="https://img.shields.io/badge/gitlab-simpleGridMaterial-yellow.svg"></a>
  <img src="https://img.shields.io/badge/simpleGridMaterial-release-green.svg">
  <img src="https://img.shields.io/badge/version-1.5.1-blue.svg">
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
  require('simple-grid-material') // Component Injection
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
  ng-data-pagination-events="listCtrl.paginationEvents"
  ng-data-loading="listCtrl.loading">

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
    <column data-bind="submitter" data-filter="uppercase'></column>
    <column data-bind="supplier_name"></column>
    <column data-bind="amount" data-filter="currency: 'USD '"></column>
    <column data-bind="number"></column>
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
#### Pagination
You can use an object pattern like shown bellow. Make sure to add the functions next, previous and changePageSize to your controller so they can work. The simple grid don't really need to know about cursor pages or similar, it just need to be aware of the quantity of lines per page, in which page state it is/should be, and if there is more pages to show or not (ng-data-pagination-enabled).
```
  ctrl.paginationObject = {
    pageSize: 25,
    pageIndex: 0,
    cursor: '',
    cursorList: [''],
    paginationEnabled: function() {
      return ctrl.paginationObject.cursor;
    }
  }
```

#### Sticky footer
To be able to use the sticky pagination footer while scrooling, you must add the attribute `scroll` to the parent element which the scroll will happen, so the internal handlers can do their jobs. For example:
```
<md-content scroll>
  <md-card>
    <simple-grid>...</simple-grid>
  </md-card>
</md-content>
```

## Stylesheets
Also make sure to import the stylesheets within your application. You can use the @import as this:
```
@import 'simple-grid-material/dist/ng-simple-grid.scss';
```

## Font family
Make sure to import the Roboto font family to your project as well, you can use the snippet below for that:
```
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
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
| ng-data-loading  | Boolean | true | false | Controls when to show and hide progress linear bar                     |
| ng-data-empty-icon | String | false | false | Material icon font name to be displayed on no results page           |
| ng-data-empty-text | String | false | false | Text to be displayed right below icon for no results page            |
| data-style (header)| string | false | false | Equivalent to style attribute of HTML, is repassed to the th elements |
| data-style (header)| boolean | false | false | Flag for sortable column item |
| data-bind (list) | string | false | false | What element value to bind to from the ng-data-list one |
| data-template (list) | string | false | false | A name of string like property on the ng-data-ctrl to bind as HTML for that columns |


## Development
Edit `version.js` and run the command below:

```
$ npm run build
```

## Metrics

[![Throughput Graph](https://graphs.waffle.io/miamarti/simpleGridMaterial/throughput.svg)](https://waffle.io/miamarti/simpleGridMaterial/metrics/throughput)

## Thanks and mentions
This project was inspired by Daniel Nagy, the styling and overall layout was based on his md-data-table.
You can find his project on https://github.com/daniel-nagy/md-data-table.
