/**
 * Mixin for drawing text in a element bounding rect
 * @module zrender/mixin/RectText
 */

define(function (require) {

    var textContain = require('../../contain/text');
    var BoundingRect = require('../../core/BoundingRect');

    var tmpRect = new BoundingRect();

    var RectText = function () {};

    function parsePercent(value, maxValue) {
        if (typeof value === 'string') {
            if (value.lastIndexOf('%') >= 0) {
                return parseFloat(value) / 100 * maxValue;
            }
            return parseFloat(value);
        }
        return value;
    }

    function setTransform(ctx, m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }

    RectText.prototype = {

        constructor: RectText,

        /**
         * Draw text in a rect with specified position.
         * @param  {CanvasRenderingContext} ctx
         * @param  {Object} rect Displayable rect
         * @return {Object} textRect Alternative precalculated text bounding rect
         */
        drawRectText: function (ctx, rect, textRect) {
            var style = this.style;
            var text = style.text;
            if (!text) {
                return;
            }
            // Convert to string
            text += '';
            var x;
            var y;
            var textPosition = style.textPosition;
            var distance = style.textDistance;
            var align = style.textAlign;
            var font = style.textFont;
            var baseline = style.textBaseline;

            textRect = textRect || textContain.getBoundingRect(text, font, align, baseline);

            // Transform rect to view space
            var transform = this.transform;
            var invTransform = this.invTransform;
            if (transform) {
                tmpRect.copy(rect);
                tmpRect.applyTransform(transform);
                rect = tmpRect;
                // Transform back
                setTransform(ctx, invTransform);
            }

            // Text position represented by coord
            if (textPosition instanceof Array) {
                // Percent
                x = rect.x + parsePercent(textPosition[0], rect.width);
                y = rect.y + parsePercent(textPosition[1], rect.height);

                ctx.textAlign = align;
                ctx.textBaseline = baseline;
            }
            else {
                var newPos = textContain.adjustTextPositionOnRect(
                    textPosition, rect, textRect, distance
                );
                x = newPos.x;
                y = newPos.y;
                // Draw text
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
            }

            var textFill = style.textFill;
            var textStroke = style.textStroke;
            textFill && (ctx.fillStyle = textFill);
            textStroke && (ctx.strokeStyle = textStroke);
            ctx.font = font;

            // Text shadow
            ctx.shadowColor = style.textShadowColor;
            ctx.shadowBlur = style.textShadowBlur;
            ctx.shadowOffsetX = style.textShadowOffsetX;
            ctx.shadowOffsetY = style.textShadowOffsetY;

            var textLines = text.split('\n');
            for (var i = 0; i < textLines.length; i++) {
                textFill && ctx.fillText(textLines[i], x, y);
                textStroke && ctx.strokeText(textLines[i], x, y);
                y += textRect.lineHeight;
            }

            // Transform again
            transform && setTransform(ctx, transform);
        }
    };

    return RectText;
});