var Matrix = List.extend(function() {
    'use strict';
    
    var height = 0;
    var width = 0;

    this.constructor = function(aheight, awidth) {
        this.super();
        height = aheight;
        width = awidth;
    };

    this.getHeight = function() {
        return height;
    }

    this.getWidth = function() {
        return width;
    }

    function xyToIndex(x, y) {
        return x*height+y;
    }

    function resizeTo(index) {
        while (this.size() <= index) {
            this.append(null);
        }
    }

    this.append = function(item) {
        this.add(item);
    }

    this.get = function(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return null;
        }
        return this.super.get(xyToIndex(x, y));
    }

    this.put = function(x, y, item) {
        var index = xyToIndex(x,y);
        resizeTo(index);
        this.set(index, item);
    }
});


