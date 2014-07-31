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

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  // create an empty board of n squares
  var masterBoard = [];
  for(var i = 0; i < n; i++) {
    masterBoard[i] = [];
    for(var j = 0; j < n; j++) {
      masterBoard[i][j] = 0;
    }
  }
  var numRows = n;

  var recursion = function (board, row, col, numQueens) {
    // iterate through each row, starting at 'ROW'
    for (var i = row; i < numRows; i++) {
      var currentRow = board[i];

      // iterate through each column, starting at 'COL' (only on first run)
      var j = 0;
      if(i === row) {
        j = col;
      }

      for (; j < numRows; j++) {
        var currentPos = currentRow[j];
        // if the current square is a zero, then it has no conflicts!
        if (currentPos === 0) {
          // clone the board
          var cloneMatrix = [];
          for (var k = 0; k < numRows; k++) {
            cloneMatrix.push(board[k].slice());
          }
          // find out what happens if we continue with currentPos = 0
          var potential = recursion(cloneMatrix, i, j + 1, numQueens);
          // if we actually got a result from potential, return it!
          if (potential) {
            return potential;
          }
          // let's find out what happens if we continue with currentPos = 1
          currentPos = 1;
          numQueens++;

          var majorIndex = j;
          var minorIndex = j;
          // loop through next rows and mark conflicts
          for (var rowLoop = i + 1; rowLoop < numRows; rowLoop++) {
            // mark column conflicts
            board[rowLoop][j] = 'c';
            // mark major diagonal conflicts
            if(majorIndex < numRows - 1) {
              majorIndex++;
              board[rowLoop][majorIndex] = 'M';
            }
            // mark minor diagonal conflicts
            if(minorIndex > 0) {
              minorIndex--;
              board[rowLoop][minorIndex] = 'm';
            }
          }
          // stop going through the rest of the row because we already placed a queen here!
          break;
        }
      }
    }
    // after going through entire board, check if this board is a solution
    // if yes, make it look pretty with 1s and 0s
    if(numQueens === numRows) {
      for(var i = 0; i < numRows; i++) {
        for(var j = 0; j < numRows; j++) {
          if(board[i][j] !== 1) {
            board[i][j] = 0;
          }
        }
      }
      return board;
    } else {
      return null;
    }
  };

  // start recursion at our initial empty board. win at life.
  var result = recursion(masterBoard, 0, 0, 0);

  // if there was no solution, return an empty board
  if(result === null) {
    result = [];
    for(var i = 0; i < n; i++) {
      result[i] = [];
      for(var j = 0; j < n; j++) {
        result[i][j] = 0;
      }
    }
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(result));

  return result;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // create an empty board of n squares
  var masterBoard = [];
  for(var i = 0; i < n; i++) {
    masterBoard[i] = [];
    for(var j = 0; j < n; j++) {
      masterBoard[i][j] = 0;
    }
  }
  var numRows = n;

  // keep track of how many solutions found so far
  var count = 0;

  var recursion = function (board, row, col, numQueens) {
    // iterate through each row, starting at 'ROW'
    for (var i = row; i < numRows; i++) {
      var currentRow = board[i];

      // iterate through each column, starting at 'COL' (only on first run)
      var j = 0;
      if(i === row) {
        j = col;
      }

      for (; j < numRows; j++) {
        var currentPos = currentRow[j];
        // if the current square is a zero, then it has no conflicts!
        if (currentPos === 0) {
          // clone the board
          var cloneMatrix = [];
          for (var k = 0; k < numRows; k++) {
            cloneMatrix.push(board[k].slice());
          }
          // find out what happens if we continue with currentPos = 0
          recursion(cloneMatrix, i, j + 1, numQueens);

          // let's find out what happens if we continue with currentPos = 1
          currentPos = 1;
          numQueens++;

          var majorIndex = j;
          var minorIndex = j;
          // loop through next rows and mark conflicts
          for (var rowLoop = i + 1; rowLoop < numRows; rowLoop++) {
            // mark column conflicts
            board[rowLoop][j] = 'c';
            // mark major diagonal conflicts
            if(majorIndex < numRows - 1) {
              majorIndex++;
              board[rowLoop][majorIndex] = 'M';
            }
            // mark minor diagonal conflicts
            if(minorIndex > 0) {
              minorIndex--;
              board[rowLoop][minorIndex] = 'm';
            }
          }
          // stop going through the rest of the row.
          break;
        }
      }
    }
    // after going through entire board, check if this board is a solution
    if(numQueens === numRows) {
      count++;
    }
  };

  // start recursion at our initial board. win at life.
  recursion(masterBoard, 0, 0, 0);
  console.log('Number of solutions for ' + n + ' queens:', count);
  return count;
};
