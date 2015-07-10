// Generated by CoffeeScript 1.9.2
define(function(require) {
  var _, apiData, apiIndex, category, categoryLayout, exports, helper, imgLayout, layout, mark, markLayout, tip;
  _ = require('lodash');
  mark = require('./mark_view');
  tip = require('./tip');
  category = require('./category');
  helper = require('./helper');
  apiIndex = -1;
  apiData = {};
  layout = null;
  imgLayout = null;
  markLayout = null;
  categoryLayout = null;
  exports = {};
  exports.init = function(data) {
    return apiData = data;
  };
  exports.prev = function() {
    var prevIndex;
    prevIndex = apiIndex - 1;
    if (prevIndex < 0) {
      if (apiData.length > 0) {
        prevIndex = apiData.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    return this.go(prevIndex);
  };
  exports.next = function() {
    var nextIndex;
    nextIndex = apiIndex + 1;
    if (nextIndex > apiData.length - 1) {
      nextIndex = 0;
    }
    return this.go(nextIndex);
  };
  exports.go = function(index, hash) {
    var chartName, curCategory, imgFile, jsonFile, path, ref;
    curCategory = (ref = apiData[apiIndex]) != null ? ref[0] : void 0;
    if (hash === curCategory) {
      return;
    }
    path = '../docv/data/api/';
    if (index === -1) {
      index = _.findIndex(apiData, function(item) {
        return item[0] === hash;
      });
    }
    chartName = apiData[apiIndex = index][0];
    jsonFile = path + chartName + '.json';
    imgFile = path + chartName + '.png';
    imgLayout.attr({
      src: imgFile
    });
    category.hashRoute(hash);
    markLayout.html('');
    return $.getJSON(jsonFile, function(data) {
      var marks;
      marks = mark.render(data);
      tip.wrap(marks);
      return $(marks).appendTo(markLayout);
    });
  };
  exports.initCategory = function(ele) {
    layout = $(ele);
    imgLayout = layout.find('img.api-chart-img');
    markLayout = layout.find('div.marks-layout');
    categoryLayout = layout.find('div.api-category-list');
    tip.bindEvent(markLayout);
    return category.init(categoryLayout, apiData);
  };
  exports.initCategoryHash = function() {
    var ref;
    if (!helper.getHashInfo().category) {
      return category.hashRoute((apiData != null ? (ref = apiData[0]) != null ? ref[0] : void 0 : void 0) || '');
    }
  };
  return exports;
});
