// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var total = 0;
      var row = this.get(rowIndex);
      for(var i = 0; i < row.length; i++) {
        if(row[i] === 1) {
          total++;
        }
      }
      return total >= 2;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var numRows = this.get('n');
      var totalConflicts = 0;
      for(var i = 0; i < numRows; i++) {
        totalConflicts += this.hasRowConflictAt(i);
      }
      return totalConflicts >= 1;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var total = 0;
      var numRows = this.get('n');
      for (var i = 0; i < numRows; i++) {
        var current = this.get(i);
        if(current[colIndex] === 1){
          total++;
        }
      }
      return total >= 2;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var numRows = this.get('n');
      var totalConflicts = 0;
      for (var i = 0; i < numRows; i++) {
        totalConflicts += this.hasColConflictAt(i);
      }
      return totalConflicts >= 1;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var total = 0;
      var numRows = this.get('n');
      var rowIndex = 0;
      var colIndex = majorDiagonalColumnIndexAtFirstRow;

      while (colIndex < 0) {
        rowIndex++;
        colIndex++;
      }
      while (rowIndex < numRows && colIndex < numRows) {
        if (this.get(rowIndex)[colIndex] === 1) {
          total++;
        }
        rowIndex++;
        colIndex++;
      }

      return total >= 2;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var numRows = this.get('n');
      var totalConflicts = 0;
      for (var i = -numRows + 2; i <= numRows - 2; i ++) {
        totalConflicts += this.hasMajorDiagonalConflictAt(i);
      }
      return totalConflicts >= 1;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var total = 0;
      var rowIndex = 0;
      var colIndex = minorDiagonalColumnIndexAtFirstRow;
      var numRows = this.get('n');

      // while our colIndex is too big
      while (colIndex >= numRows) {
        // take away from colIndex
        colIndex--;
        // add to rowIndex
        rowIndex++;
      }
      // while rowIndex < numRows and colIndex >= 0
      while (rowIndex < numRows && colIndex >= 0) {
        // add this square to the total;
        if (this.get(rowIndex)[colIndex] === 1) {
          total++;
        }
        colIndex--;
        rowIndex++;
      }

      return total >= 2;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var numRows = this.get('n');
      var totalConflicts = 0;
      for (var i = 1; i <= numRows * 2 -3; i++) {
        totalConflicts += this.hasMinorDiagonalConflictAt(i);
      }
      return totalConflicts >= 1;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
