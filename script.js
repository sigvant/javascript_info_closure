// Does a function pickup latest changes?
// importance: 5
// The function sayHi uses an external variable name. When the function runs, 
// which value is it going to use?

let name = 'john';

function sayHi() {
	alert('Hi, ' + name);
}

name = 'Pete';

sayHi(); // 'Pete'

// such situations are common both in browser and server-side development. A function may be scheduled
// to execute later than it is created, for instance, after a user action or a network request.

// A function gets outer variables as THEY ARE NOW. The most recent values.
// Old variable values are not saved anywhere. When a function wants a variable, it takes the
// current value from its own Lexical Environment or the outer one.

// ########################################################################################################

// Which variables are available?
// importance: 5
// The function makeWorker below makes another function and returns it. That new function 
// an be called from somewhere else.

// Will it have access to the outer variables from its creation place, or the invocation place, or both?

function makeWorker() {
	let name = 'Pete';

	return function() {
		alert(name);
	};
}

let name = "john";

// create a function
let work = makeWorker();

// call it
work(); // what will it show?

// which value will show? 'Pete' or 'John'? IT IS PETE! FFS

// The work() function in the code gets name from the place of its origin through the outer lexical
// environment reference. But if there were no let name in makeWorker(), then the search would go
// outside and take the global variable as we can see from the chain above. In that case, 'John'


// ########################################################################################################

// Are counters independent?
// importance: 5
// Here we make two counters: counter and counter2 using the same makeCounter function.

// Are they independent? What is the second counter going to show? 0,1 or 2,3 or something else?

function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
let counter2 = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1

alert( counter2() ); // ?
alert( counter2() ); // ?

// 0, 1 Functions counter and coutner 2 are created by different invocations of makeCounter. So they
// have independent outer lexical environments, each one has its own count.


// ########################################################################################################

// Counter object
// importance: 5
// Here a counter object is made with the help of the constructor function.

// Will it work? What will it show?

function Counter() {
  let count = 0;

  this.up = function() {
    return ++count;
  };
  this.down = function() {
    return --count;
  };
}

let counter = new Counter();

alert( counter.up() ); // ?
alert( counter.up() ); // ?
alert( counter.down() ); // ?

// surely it will work just fine. Both nested functions are created within the same outer lexical
// environment, so they share access to the same count variable!


// ########################################################################################################

// Function in if
// Look at the code. What will be the result of the call at the last line?

let phrase = "Hello";

if (true) {
  let user = "John";

  function sayHi() {
    alert(`${phrase}, ${user}`);
  }
}

sayHi();

// the rsult is an error. The function sayHi is declared inside the if, so it only lives inside it.
// there is no sayHi() outside the function.

// ########################################################################################################

// Sum with closures
// importance: 4
// Write function sum that works like this: sum(a)(b) = a+b.

// Yes, exactly this way, using double parentheses (not a mistype).

// For instance:

sum(1)(2) = 3
sum(5)(-1) = 4

// #### attempt at solution
// for the second parentheses to work, the first ones must return a function:

// like this:

function sum(a) {

	return function(b) {
		return a + b; // takes 'a' from the outer lexical environment
	};
}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1) ); // 4

// ########################################################################################################

// Is variable visible?
// importance: 4
// What will be the result of this code?

let x = 1;

function func() {
  console.log(x); // ?

  let x = 2;
}

func();

// the result is an error! ReferenceError: Cannot access 'x' before initialization.

// in this example we can observe the peculiar difference between a 'non-existing' and 'uninitialized' variable.
// As you mau have read in the article Variable scope, closure, a variable starts in the 'uninitialized' state
// from the moment when the execution enters a code block (or a function). And it stays uninitalzied until the
// corresponding let statement.

// In other words, a variable technically exists, but can't be used before let. The code above demonstrates it.

function func() {
  // the local variable x is known to the engine from the beginning of the function,
  // but "uninitialized" (unusable) until let ("dead zone")
  // hence the error

  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 2;
}

// This zone of temporary unusability of a variable (from the beginning of 
// the code block till let) is sometimes called the “dead zone”.

// ########################################################################################################

// Filter through function
// importance: 5
// We have a built-in method arr.filter(f) for arrays. It filters all elements through the function f. 
// If it returns true, then that element is returned in the resulting array.

// Make a set of “ready to use” filters:

// inBetween(a, b) – between a and b or equal to them (inclusively).
// inArray([...]) – in the given array.
// The usage must be like this:

// arr.filter(inBetween(3,6)) – selects only values between 3 and 6.
// arr.filter(inArray([1,2,3])) – selects only elements matching with one of the members of [1,2,3].
// For instance:

function inBetween(a, b) {
  return function(x) {
    return x >= a && x <= b;
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6

// this function is passed as the argument of the filter method.
// the call returns a function that returns only the values of the condition.

function inArray(arr) {
  return function(x) {
    return arr.includes(x);
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inArray([1, 2, 10])) ); // 1,2

// this function is passed as the argument of the filter method.
// the call returns a function that returns only the values of the condition.

// important to notice that it only works because we wrote a function for filter.
// it would not work with only the array, as it requires a function.

// the double 'return' or double function works because we are checking for 
// the value inside the array, so the first return remembers the array and
// the second return rememebers the actual value

// ########################################################################################################

// Sort by field
// importance: 5
// We’ve got an array of objects to sort:

let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" }
];

// The usual way to do that would be:

// by name (Ann, John, Pete)
users.sort((a, b) => a.name > b.name ? 1 : -1);

// by age (Pete, Ann, John)
users.sort((a, b) => a.age > b.age ? 1 : -1);

// Can we make it even less verbose, like this? // those are the functions that we usually pass to the sort
// method in order to make something be sorted.

users.sort(byField('name'));
users.sort(byField('age'));

// So, instead of writing a function, just put byField(fieldName).
// Write the function byField that can be used for that.

// here we need to do the same trick as before, but remember to propagate the function properly

function byField(fieldName){
	return (a, b) => a[fieldName] > b[fieldName] ? 1 : -1;
}

// I don't actually understand how this works

// ########################################################################################################

Army of functions
importance: 5
The following code creates an array of shooters.

Every function is meant to output its number. But something is wrong…

#
function makeArmy() {
	let shooters = [];

	let i = 0;
	while (i < 10) {
		let shooter = function() {
			alert(i);
		};
		shooters.push(shooter);
		i++;
	}


	return shooters;
}

let army = makeArmy();

// all shooters show 10 instead of their numbers 0, 1, 2, 3...
army[0](); // 10 from the shooter number 0
army[1](); // 10 from the shooter number 1
army[2](); // 10 ...and so on.
#

// because of the lexical environment, the value of i outside the function is 10 (after the loop was executed
// several times during the function call) to fix that we need to either use another variable for the alerts
// or perhaps exchange the while for a for loop, because we can declare it 'in the same lexical environment'

function makeArmy() {

  let shooters = [];

  for(let i = 0; i < 10; i++) {
    let shooter = function() { // shooter function
      alert( i ); // should show its number
    };
    shooters.push(shooter);
  }

  return shooters;
}

let army = makeArmy();

army[0](); // 0
army[5](); // 5

// now the i is the value of the loop for each shooter call!


