/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = [];
  // for i: 0 through n
  for (var i = 0; i < n; i++) {
    solution[i] = [];
    for (var j = 0; j < n; j++) {
      if (i === j) {
        solution[i][j] = 1;
      } else {
        solution[i][j] = 0;
      }
    }
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount;

  var factorial = function (num) {
    if (num === 1) {
      return num;
    } else {
      return num * factorial(num-1);
    }
  };

  solutionCount = factorial(n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

var count;

var enoughQueens = function(board) {
  var numRows = board.get('n');

  var numQueens = 0;
  for(var i = 0; i < numRows; i++) {
    var currentRows = board.get(i);
    for(var j = 0; j < numRows; j++) {
      if(currentRows[j] === 1){
        numQueens++;
      }
    }
  }
  return numQueens === numRows;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // create an empty board of n squares
  var masterBoard = new Board({n: n});
  var numRows = n;

  // keep track of how many solutions found so far
  count = 0;


  var recursion = function (board, row, col) {

    // iterate through each row, starting at 'ROW'
    for (var i = row; i < numRows; i++) {

      var currentRow = board.get(i);

      // iterate through each column, starting at 'COL' only on first run through.
      var j = 0;
      if(i === row) {
        j = col;
      }
      for (; j < numRows; j++) {

        

        // if the current square is a zero, then check for diagonal conflicts!
        if (currentRow[j] === 0) {
          currentRow[j] = 1;
          var majorMagicNumber = j - i;
          var minorMagicNumber = j + i;
          // if not viable......
          if (board.hasMajorDiagonalConflictAt(majorMagicNumber) || board.hasMinorDiagonalConflictAt(minorMagicNumber)) {
            // leave it alone, keep it 0, and move on!
            currentRow[j] = 0;
          }
          // if viable.......
          else {
            // clone it and let the clone do its thing
            currentRow[j] = 0;
            var cloneMatrix = [];
            for (var k = 0; k < numRows; k++) {
              var cloneRow = board.get(k).slice();
              cloneMatrix.push(cloneRow);
            }
            cloneMatrix = new Board(cloneMatrix);
            recursion(cloneMatrix, i, j+1);
            
            // change the current square to 1!
            currentRow[j] = 1;
            // change the conflicts to -1!
              // iterate through the rest of the row
                // for each position, set to -1
            for (var rowLoop = j + 1 ; rowLoop < numRows; rowLoop++) {
              currentRow[rowLoop] = -1;
            }
            for (var colLoop = i + 1; colLoop < numRows; colLoop++) {
              // change all array[i] to -1
                // for each position, set to -1
              board.get(colLoop)[j] = -1;
            }
            
          }
        }

        // continue







        // // clone current board
        // var cloneMatrix = [];
        // for (var k = 0; k < numRows; k++) {
        //   var cloneRow = board.get(k).slice();
        //   cloneMatrix.push(cloneRow);
        // }
        // cloneMatrix = new Board(cloneMatrix);

        // // check if the current square is a viable position
        // currentRow[j] = 1;
        // var majorMagicNumber = j - i;
        // var minorMagicNumber = j + i;
        // // if not, revert back to original
        // if (board.hasRowConflictAt(i) || board.hasColConflictAt(j)
        //       || board.hasMajorDiagonalConflictAt(majorMagicNumber)
        //       || board.hasMinorDiagonalConflictAt(minorMagicNumber)) {
        //   currentRow[j] = 0;
        // }
        // // if it is viable, create a new branch!
        // else {
        //   recursion(cloneMatrix, i, j+1);
        // }
      }
    }
    // after going through entire board, check if this board is a solution
    if(enoughQueens(board)) {
      count++;
    }
  };

  // start recursion at our initial board. win at life.
  recursion(masterBoard, 0, 0);
  console.log('Number of solutions for ' + n + ' queens:', count);
  return count;
};
