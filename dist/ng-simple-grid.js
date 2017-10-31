!function(t,e){"use strict";e.module("ngSimpleGrid",["ng"]).directive("simpleGrid",function(t){"ngInject";return{restrict:"E",scope:{ngDataList:"=ngDataList",ngDataClick:"=ngDataClick",ngDataPagination:"=ngDataPagination",ngDataPaginationEnabled:"=ngDataPaginationEnabled",ngDataPaginationEvents:"=ngDataPaginationEvents",ngDataLength:"@ngDataLength",ngDataSingleOrdering:"@ngDataSingleOrdering",ngDataDefaultLength:"=ngDataDefaultLength",$ctrl:"=ngDataCtrl"},link:function(e,n){var a=function(t,n){var a=t?t.split(","):e.ngDataList?e.ngDataList.length:0,i=[].map.call(a,function(t){return{value:t.trim(),label:t.trim()}});this.fnEvent=n,this.length=i,this.selectLength=i&&i.length>0?i[0].value:e.ngDataList?e.ngDataList.length:0,this.selectLength=e.ngDataDefaultLength&&!Number.isNaN(e.ngDataDefaultLength)?e.ngDataDefaultLength:this.selectLength,this.page=0,this.sortableMap={}};a.prototype={previous:function(){this.page--,this.runFnEvent("previous"),e.$ctrl.previous()},next:function(){this.page++,this.runFnEvent("next"),e.$ctrl.next()},runFnEvent:function(t){var e={};for(var n in this.sortableMap)e[this.getCamelCase(n)]=this.sortableMap[n]?"desc":"asc";this.fnEvent={status:t,page:this.page,length:this.selectLength,sortableMap:e}},setSelectLength:function(){this.runFnEvent("change-length"),e.$ctrl.changePageSize(this.fnEvent.length)},getCamelCase:function(t){return t.replace(/(?:^\w|[A-Z]|\b\w)/g,function(t,e){return 0===e?t.toLowerCase():t.toUpperCase()}).replace(/\s+/g,"")},sortable:function(t){if("true"===e.ngDataSingleOrdering){var n={name:t,value:this.sortableMap[t]};this.sortableMap={},this.sortableMap[n.name]=n.value}!1===this.sortableMap[t]?delete this.sortableMap[t]:this.sortableMap[t]=void 0===this.sortableMap[t]||!this.sortableMap[t],this.runFnEvent("sortable")}};var i={main:function(){i.init(function(){i.load(i.addEventListeners)})},init:function(t){e.pagination=new a(e.ngDataLength,e.ngDataPaginationEvents),t&&t()},load:function(t){i.setTemplate(),t&&t()},addEventListeners:function(){e.getStatusSortable=i.getStatusSortable.bind(i)},render:function(a){t(n.html(a).contents())(e)},getStatusSortable:function(t){if(e.pagination.sortableMap.hasOwnProperty(t))return e.pagination.sortableMap[t]?"arrow_drop_down":"arrow_drop_up"},getColumnsHeader:function(){return[].map.call(n[0].querySelectorAll("header column"),function(t){var e="<md-icon>{{getStatusSortable('"+t.innerHTML+"')}}</md-icon>",n="";return n+='<th md-column class="md-column ng-scope ng-isolate-scope" '+JSON.stringify(t.dataset).replace(/{"/gi,"").replace(/":/gi,"=").replace(/}/gi," ")+">",n+=t.dataset.sortable?'<div style="cursor: pointer;" ng-click="pagination.sortable(\''+t.innerHTML+"')\"><md-icon>sort</md-icon>"+t.innerHTML+e+"</div>":t.innerHTML,n+="</th>"}).join("")},getColumnsBody:function(){var t="";return t+='<tr md-row md-select="item" class="md-row ng-scope ng-isolate-scope md-clickable" aria-disabled="false" ng-repeat="$line in ngDataList">',t+=[].map.call(n[0].querySelectorAll("list column"),function(t){var e='<td md-cell class="md-cell ng-scope md-clickable" role="button" tabindex="0" '+(t.dataset.disabledClick?"":'ng-click="ngDataClick($index, $line)"')+">";return e+=t.dataset.bind?"{{$line."+t.dataset.bind+"}}":t.innerHTML,e+="</td>"}).join(""),t+="</tr>"},setTemplate:function(){var t="";t+="<md-table-container>",t+='<table class="md-data-table ng-pristine ng-untouched ng-valid md-table ng-isolate-scope ng-not-empty" md-table md-progress="false" multiple="true" aria-invalid="false">',t+='  <thead ng-show="true" md-head class="md-head ng-isolate-scope">',t+='    <tr md-row class="md-row">',t+="      "+i.getColumnsHeader(),t+="    </tr>",t+="  </thead>",t+='  <tbody md-body class="md-body">',t+="    "+i.getColumnsBody(),t+="  </tbody>",t+="</table>",t+="</md-table-container>",t+='<div class="ng-scope md-table-pagination ng-isolate-scope simple-grid-pagination" aria-hidden="false" style="" ng-if="ngDataPagination">',t+='  <div class="limit-select ng-scope">',t+='    <div class="label ng-binding">Rows per page:</div>',t+='    <md-select class="md-table-select" ng-model="pagination.selectLength" ng-change="pagination.setSelectLength()">',t+='      <md-option ng-repeat="opt in pagination.length" ng-value="opt.value">',t+="        {{opt.label}}",t+="      </md-option>",t+="    </md-select>",t+="  </div>",t+='  <div class="buttons">',t+='    <button class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Previous" ng-click="pagination.previous()" ng-disabled="!pagination.page">',t+='      <md-icon md-svg-icon="navigate-before.svg" class="ng-scope" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></md-icon>',t+="    </button>",t+='    <button class="md-icon-button md-button md-ink-ripple" type="button" aria-label="Next" ng-click="pagination.next()" ng-disabled="!ngDataPaginationEnabled()">',t+='      <md-icon md-svg-icon="navigate-next.svg" class="ng-scope" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></md-icon>',t+="    </button>",t+="  </div>",t+="</div>",i.render(t)}};i.main()}}})}(window,window.angular);