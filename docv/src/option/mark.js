// Generated by CoffeeScript 1.9.2
define(function(require) {
  var CONST, MARK_DEF, MarkFactory, _, markTemplate, oneColor;
  _ = require('lodash');
  oneColor = require('onecolor');
  require('jqueryui');
  markTemplate = function(mark) {
    return "<div class='mark-item " + mark.type + "' " + CONST.DATA_KEY + "='" + (JSON.stringify(mark.data)) + "' " + CONST.SIZE_KEY + "='" + mark.size + "' style='top: " + mark.style.y + "; left: " + mark.style.x + "; z-index: " + mark.style.z + "; color: " + mark.style.color + ";' > </div>";
  };
  MARK_DEF = {
    markWidth: 16,
    markHeight: 16,
    color: '#000000',
    type: 'icon-arrow-up-left',
    z: 10
  };
  CONST = {
    DATA_KEY: 'data-mark',
    SIZE_KEY: 'data-size',
    TYPE_REG: /\s*(icon-arrow-[\w\-]+)\s*/i,
    SELECTOR: '.mark-item'
  };
  $.widget('mark.mark', {
    _create: function() {
      return this.ele = $(this.element);
    },
    getData: function() {
      return JSON.parse(this.ele.attr(CONST.DATA_KEY) || {});
    },
    setData: function(data) {
      return this.ele.attr(CONST.DATA_KEY, JSON.stringify(data));
    },
    setType: function(type) {
      var curType;
      curType = this.getType();
      if (curType) {
        this.ele.removeClass(curType);
      }
      return this.ele.addClass(type);
    },
    getType: function() {
      var ref;
      return (ref = this.ele.attr('class').match(CONST.TYPE_REG)) != null ? ref[1] : void 0;
    },
    getSize: function() {
      var height, ref, width;
      return ref = this.ele.attr(CONST.SIZE_KEY).split(','), width = ref[0], height = ref[1], ref;
    },
    getStyles: function(styleName) {
      var i, key, len, ref, ref1, res, style, styleObj, value;
      styleObj = {};
      ref = this.ele.attr('style').split(';');
      for (i = 0, len = ref.length; i < len; i++) {
        style = ref[i];
        if (!(_.trim(style).length > 0)) {
          continue;
        }
        ref1 = style.split(':'), key = ref1[0], value = ref1[1];
        styleObj[_.trim(key)] = _.trim(value);
      }
      return res = styleName ? styleObj[styleName] : styleObj;
    },
    setStyle: function(styleName, value) {
      return this.ele.css(styleName, value);
    },
    toJSON: function(unit) {
      var data, height, left, ref, size, style, styleObj, styles, top, type, width;
      if (unit == null) {
        unit = 'percent';
      }
      size = this.getSize();
      styles = this.getStyles();
      width = size[0], height = size[1];
      styleObj = {
        x: styles.left,
        y: styles.top,
        z: styles['z-index']
      };
      styleObj.color = oneColor(styles.color).hex();
      if (unit === 'percent') {
        if (styles.top.indexOf('px') !== -1) {
          top = styles.top.replace('px', '');
          styleObj.y = _.round(top / height * 100, 2) + '%';
        }
        if (styles.left.indexOf('px') !== -1) {
          left = styles.left.replace('px', '');
          styleObj.x = _.round(left / width * 100, 2) + '%';
        }
      }
      ref = [styleObj, this.getData(), this.getType(), size.join(',')], style = ref[0], data = ref[1], type = ref[2], size = ref[3];
      return {
        style: style,
        data: data,
        type: type,
        size: size
      };
    }
  });
  MarkFactory = (function() {
    function MarkFactory(options1) {
      this.options = options1;
      this.markList = [];
    }

    MarkFactory.prototype.setOption = function(options) {
      return MARK_DEF = _.merge(MARK_DEF, options);
    };

    MarkFactory.prototype.create = function(params) {
      var color, data, height, ref, ref1, type, widget, width, x, y, z;
      ref = _.merge(MARK_DEF, params), x = ref.x, y = ref.y, width = ref.width, height = ref.height, color = ref.color, type = ref.type;
      ref1 = [(x - MARK_DEF.markWidth / 2) + 'px', (y - MARK_DEF.markHeight / 2) + 'px', MARK_DEF.z++], x = ref1[0], y = ref1[1], z = ref1[2];
      data = {
        style: {
          x: x,
          y: y,
          z: z,
          color: color
        },
        data: {
          t: '',
          l: []
        },
        type: type,
        size: [width, height].join(',')
      };
      widget = $(markTemplate(data)).mark();
      this.markList.push(widget);
      return widget;
    };

    MarkFactory.prototype.render = function(marks) {
      var html, widgets;
      html = _.map(marks, function(mark) {
        return markTemplate(mark);
      }).join('');
      widgets = $(html).mark();
      return this.markList = widgets;
    };

    MarkFactory.prototype.remove = function(mark) {
      _.remove(this.markList, mark);
      return $(mark).mark('destroy');
    };

    MarkFactory.prototype.getMark = function() {
      return this.markList;
    };

    MarkFactory.prototype.clearMark = function() {
      _.each(this.markList, function(mark) {
        return $(mark).mark('destroy');
      });
      return this.markList = [];
    };

    return MarkFactory;

  })();
  return new MarkFactory();
});
