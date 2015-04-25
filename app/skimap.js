/*
 * Class for a Skiing map, able to calculate the longest ski route.
 *
 * @author Jesus Seijas
 */
var SkiMap = Class.extend(function() {
    'use strict';

    var matrix = null;

    /*
     * Constructor of the class.
     *
     * @constructor
     */
    this.constructor = function() {
    };

    /*
     * Gets the height of the Ski map
     *
     * @return {number} Height of the Ski map.
     */
    this.getHeight = function() {
        return matrix === null ? 0 : matrix.getHeight();
    }

    /*
     * Gets the width of the Ski map
     *
     * @return {number} Width of the Ski map.
     */
    this.getWidth = function() {
        return matrix === null ? 0 : matrix.getWidth();
    }


    /*
     * Loads the Ski Map from a string, containing the map file.
     *
     * @param {string} Map file to be loaded.
     */
    this.loadFrom = function(str) {
        var allLines = str.split('\n');
        if (allLines.length < 1) {
            console.log('No lines found');
            return false;
        }
        // First line contains dimensions
        var tokens = allLines[0].trim().split(' ');
        if (tokens.length < 2) {
            console.log('First line must contain matrix dimensions');
            return false;
        }

        // Create the matrix
        matrix = new Matrix(parseInt(tokens[0]), parseInt(tokens[1]));
        console.log('Loading matrix '+this.getHeight()+'x'+this.getWidth());
        if (allLines.length < this.getHeight()+1) {
            console.log('The matrix must have at least '+this.getHeight()+' rows');
            return false;
        }
        // Fill matrix with nodes
        for (var i = 0; i < this.getHeight(); i++) {
            tokens = allLines[i+1].trim().split(' ');
            if (tokens.length < this.getWidth()) {
                console.log('The line '+i+1+' of the matrix must have at least '+this.getWidth()+' elements');
                return false;
            }
            for (var j = 0; j < tokens.length;j++) {
                matrix.append(new SkiNode(parseInt(tokens[j])));
            }
        }
        console.log('Matrix loaded!');
    }

    /*
     * Calculate the longest route of this ski map.
     * Algorithm explanation:
     * - First, generate a graph connecting the nodes.
     * - When a node is tail (has no sons) then mark the node and add it to the tailNodes structure
     * - When a node is not tail (has son) add it to the potentialStartNodes structure
     * - While the potentialStartNodes structure contains nodes do:
     *       + for each node: 
     *           - if all the sons of the node are marked, then this node is now a tailNode
     *           - if at least one son is not marked then remove marked sons and add it to potentialStartNodes
     *       + Mark all tailNodes
     * Also, there is a tail property on the nodes to accelerate the process of finding the distance without iterating
     * all the path.
     * 
     * @return {SkiNode} Winner node
     */
    this.calculateRoute = function() {
        var potentialStartNodes = [];
        // Go all over the matrix connecting nodes
        var currentDepth = 1;
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                var node = matrix.get(x,y);
                for (var i = 0; i < 4; i++) {
                    var signo = i % 2 == 0 ? -1 : 1;
                    var deltaX = i > 1 ? 1 : 0;
                    var deltaY = signo * (1-deltaX);
                    deltaX = signo * deltaX;
                    var otherNode = matrix.get(x+deltaX, y+deltaY);
                    if ((otherNode != null) && (otherNode.altitude < node.altitude)) {
                        //console.log(node.toString()+" -> "+otherNode.toString());
                        node.connect(otherNode);
                    }
                }
                if (node.isTail()) {
                    node.depth = currentDepth;
                    node.marked = true;
                } else {
                    potentialStartNodes.push(node);
                }
            }
        }
        console.log('Potential start nodes: '+potentialStartNodes.length);
        while (potentialStartNodes.length > 0) {
            currentDepth++;
            var oldPotentialStartNodes = potentialStartNodes;
            potentialStartNodes = [];
            var tailNodes = [];
            for (var i = 0; i < oldPotentialStartNodes.length; i++) {
                var node = oldPotentialStartNodes[i];
                if (node.allSonsMarked()) {
                    node.depth = currentDepth;
                    tailNodes.push(node);
                } else {
                    node.cleanMarkedSons();
                    potentialStartNodes.push(node);
                }
            }
            for (var i = 0; i < tailNodes.length; i++) {
                tailNodes[i].marked = true;
            }
            console.log('Tail nodes: '+tailNodes.length);
            console.log('Potential start nodes: '+potentialStartNodes.length);
        }
        var winner = tailNodes[0];
        for (var i = 1; i < tailNodes.length; i++) {
            if (tailNodes[i].getTailDistance() > winner.getTailDistance()) {
                winner = tailNodes[i];
            }
        }
        return winner;
    }
});


/*
 * Class for a Ski node
 *
 * @author Jesus Seijas
 */
var SkiNode = function(altitude) {
    this.altitude = altitude;
    this.sons = [];
    this.parents = [];
    this.marked = false;
    this.depth = 0;

    /*
     * Connect this node to another one, being the target the son
     *
     * @param {SkiNode} Node to be son of this one.
     */
    this.connect = function(target) {
        this.sons.push(target);
        target.addParent(this);
    }

    /*
     * Adds a parent node to this one.
     *
     * @param {SkiNode} Node to be parent of this.
     */
    this.addParent = function(parent) {
        this.parents.push(parent);
    }

    /*
     * Indicates if all the sons of this node are marked
     *
     * @return {boolean} True if all sons are marked, false otherwise.
     */
    this.allSonsMarked = function() {
        for (var i = 0; i < this.sons.length; i++) {
            if (!this.sons[i].marked) {
                return false;
            }
        }
        return true;
    }

    /*
     * Indicates if this node is a tail node.
     *
     * @return {boolean} True when the node has no sons, false otherwise.
     */
    this.isTail = function() {
        return this.sons.length === 0;
    }

    /*
     * Remove all sons that are marked
     */
    this.cleanMarkedSons = function() {
        var i = 0;
        while (i < this.sons.length) {
            if (this.sons[i].marked) {
                this.sons.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    /*
     * Gets the altitude delta between this node and its tail.
     *
     * @return {number} Altitude delta between this node and its tail.
     */
    this.getTailDistance = function() {
        var route = this.getRoute();
        return route[0].altitude - route[route.length-1].altitude;
    }


    this.getBestSon = function() {
        var bestDepth = this.sons[0].depth;
        for (var i = 1; i < this.sons.length; i++) {
            var sonDepth = this.sons[i].depth;
            if (sonDepth > bestDepth) {
                bestDepth = sonDepth;
            }
        }
        var bestSon = null;
        for (var i = 0; i < this.sons.length; i++) {
            if (this.sons[i].depth === bestDepth) {
                if (bestSon === null) {
                    bestSon = this.sons[i];
                } else {
                    if (this.sons[i].altitude < bestSon.altitude) {
                        bestSon = this.sons[i];
                    }
                }
            }
        }
        return bestSon;
    }

    /*
     * Gets the ski route from a node as a string, with all the altitudes of the nodes score separated.
     *
     * @param {SkiNode} Node to be shown as a route.
     */
    this.getRoute = function() {
        var result = [];
        var node = this;
        result.push(node);
        while (node.sons.length > 0) {
            node = node.getBestSon();
            result.push(node);
        }
        return result;
    }
}

