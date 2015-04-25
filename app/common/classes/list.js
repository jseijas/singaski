/*
 * Class for a list object.
 */
var List = Class.extend(function() {
    'use strict';

    var data;

    /*
     * Constructor of the class.
     *
     * @constructor
     */
    this.constructor = function() {
        data = [];
    };

    /*
     * Add an item to the end of the list.
     *
     * @param {object} item Item to be added
     */
    this.add = function(item) {
        data.push(item);
    };

    /*
     * Add all elements from another list to this one, at the end.
     *
     * @param {List} list Source list to add the elements.
     */
    this.addList = function(list) {
        if (list) {
            for (var i = 0; i < list.size(); i++) {
                this.add(list.get(i));
            }
        }
    };

    /*
     * Add all elements from an array to this list, at the end.
     *
     * @param {Array} arr Source array to add the elements.
     */
    this.addArray = function(arr) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                this.add(arr[i]);
            }
        }
    };

    /*
     * Insert an element to the list at the given position.
     *
     * @param {number} i Position to add the item. Position 0 means begin of list.
     * @param {Object} item Item to be inserted.
     */
    this.insert = function(i, item) {
        return data.splice(i, 0, item);
    };

    /*
     * Get an element from the list. If the position provided is not valid, returns null.
     *
     * @param {number} i Position of the element to be retrieved.
     * @return {Object} Item retrieved, null if invalid position.
     */
    this.get = function(i) {
        if ((i >= 0) && (i < data.length)) {
            return data[i];
        }
        return null;
    };

    /*
     * Set a new value to an existing position of the list.
     *
     * @param {number} i Position of the element to be changed.
     * @param {Object} item New item to be setted.
     */
    this.set = function(i, item) {
        if ((i >= 0) && (i < data.length)) {
            data[i] = item;
        }
    };

    /*
     * Gets the number of elements contained in the list.
     *
     * @return {number} Number of elements contained in the list.
     */
    this.size = function() {
        return data.length;
    };

    /*
     * Remove all the elements from the list.
     */
    this.clear = function() {
        data.length = 0;
    };

    /*
     * Indicates if the list is empty.
     *
     * @return {boolean} True if the list is empt, false if the list contains at least one element.
     */
    this.isEmpty = function() {
        return data.length === 0;
    };

    /*
     * Search an object in the list and return its position from left to right.
     *
     * @param {Object} item Item to be searched.
     * @return {number} First position of the item if found, -1 if not found.
     */
    this.indexOf = function(item) {
        for (var i = 0; i < data.length; i++) {
            if (data[i] === item) {
                return i;
            }
        }
        return -1;
    };

    /*
     * Search an object in the list and return its position from right to left.
     *
     * @param {Object} item Item to be searched.
     * @return {number} Last position of the item if found, -1 if not found.
     */
    this.lastIndexOf = function(item) {
        for (var i = data.length-1; i>= 0; i--) {
            if (data[i] === item) {
                return i;
            }
        }
        return -1;
    };

    /*
     * Search an object in the list and return true if found, false otherwise.
     *
     * @param {Object} item Item to be searched.
     * @return {boolean} True if the list contains the item, false otherwise.
     */
    this.contains = function(item) {
        return this.indexOf(item) > -1;
    };

    /*
     * Remove the element at the given position from the list.
     *
     * @param {number} i Position of the element to be removed.
     */
    this.removeAt = function(i) {
        if ((i >= 0) && (i < data.length)) {
            return data.splice(i, 1);
        }
    };

    /*
     * Remove the first occurence of an item from the list.
     *
     * @param {Object} item Object to be removed from the list.
     */
    this.remove = function(item) {
        this.removeAt(this.indexOf(item));
    };

    /*
     * Indicates if the list is equal to another list. To be equals, the list must have the same size
     * and the same element at each position.
     *
     * @param {List} other List to be compared with.
     * @return {boolean} True if the lists are equals, false otherwise.
     */
    this.equals = function(other) {
        if (other === null) {
            return false;
        }
        if (!(other instanceof List)) {
            return false;
        }
        if (other.size() !== this.size()) {
            return false;
        }
        for (var i = 0; i < this.size(); i++) {
            if (other.get(i) !== this.get(i)) {
                return false;
            }
        }
        return true;
    };

    /*
     * Receives a function to iterate the list.
     * The function will receive the item and the position of each iteration.
     *
     * @param {Function} fn Function to be invoked.
     * @param {Object} caller Caller object for invoking the function.
     */
    this.foreach = function(fn, caller) {
        if (fn) {
            for (var i = 0; i < this.size(); i++) {
                fn.call(caller, data[i], i);
            }
        }
    };


    /*
     * Receives a function to iterate the list, reverse direction.
     * The function will receive the item and the position of each iteration.
     *
     * @param {Function} fn Function to be invoked.
     * @param {Object} caller Caller object for invoking the function.
     */
    this.foreachReverse = function(fn, caller) {
        if (fn) {
            for (var i = this.size()-1; i >= 0; i--) {
                fn.call(caller, data[i], i);
            }
        }
    };

    /*
     * Receives a function that will be called for each element of the list.
     * This function must return true or false for each method, to decide if the item pass the filter.
     *
     * @param {Function} fn Function to be invoked for the filter.
     * @param {Object} caller Caller object for invoking the function.
     * @return {List} List of objects filtered.
     */
    this.filter = function(fn, caller) {
        var result = new List();
        for (var i = 0; i < data.length; i++) {
            if (fn.call(caller, data[i], i)) {
                result.add(data[i]);
            }
        }
        return result;
    };

    /*
     * Receives a function that will transform an element of the list.
     * The map function will iterate each element on the list, and returns a new list of transformed elements.
     *
     * @param {Function} fn Function to be invoked for the mapping.
     * @param {Object} caller Caller object for invoking the function.
     * @return {List} List of mapped objects.
     */
    this.map = function(fn, caller) {
        var result = new List();
        for (var i = 0; i < data.length; i++) {
            result.add(fn.call(caller, data[i], i));
        }
        return result;
    };

    /*
     * Receives a function that will be invoked for each element on the list.
     * This function will receive a return value (passed in each iteration), a initial value and the index of the element.
     *
     * @param {Function} fn Function to be invoked for the mapping.
     * @param {Object} val Initial value.
     * @param {Object} caller Caller object for invoking the function.
     * @return {Object} Return value of the reduce.
     */
    this.reduce = function(fn, val, caller) {
        var rval = val;
        this.foreach(function(val, index) {
            rval = fn.call(caller, rval, val, index);
        }, caller);
        return rval;
    };
});
