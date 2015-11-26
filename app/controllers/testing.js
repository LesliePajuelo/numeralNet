var data = [0.25,0.23,0.35,0.89,0.38,0.15,0.25,0.0001,1,0.000000000002]

function findIndexOfHighest(array) {
  var Highest = 0;
  var listOfHighest = [];
  var indexOfHighest = [];
  var highestProb = [];
  var secondProb = [];

  for (var i = 0; i < array.length; i++) {
    if (!Highest || array[i] > Highest) {
      Highest = array[i];
      listOfHighest.push(Highest);
      indexOfHighest.push(i);
    }
  }

  highestProb.push(indexOfHighest.pop(), listOfHighest.pop())
  secondProb.push(indexOfHighest.pop(), listOfHighest.pop())
  console.log(highestProb);
  console.log(secondProb);
}

findIndexOfHighest(data)