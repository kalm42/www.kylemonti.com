---
title: Questions to answer when learning a new language
date: 2021-02-19
excerpt: A running list of the fundamental questions I quiz a friend on while teaching them JavaScript — broad enough, I think, to apply to picking up any language.
tags: JavaScript, Learning
---

I've been teaching a friend JavaScript, and quizzing him along the way made it obvious that a lot of these questions are broad enough to apply to any language, not just this one. I've learned JavaScript, Swift, and PHP to what I'd call a proficient level, which feels like enough to make that call.

I've also played around with Rust, and plan on getting much better at it — partly to get more comfortable with object-oriented programming outside of JavaScript's version of it. For now, this is the list for JavaScript. I'll extend it to other languages as I go, and note anywhere a question turns out to be JavaScript-specific rather than universal.

## What are the primitive types?

- string
- number
- boolean
- null
- undefined
- symbol
- bigint

`object` isn't on this list on purpose — it's the one built-in type that isn't primitive. Objects (and arrays, and functions) are compared and passed around by reference, not by value, which is exactly what makes them not primitive.

## What is a string?

A sequence of characters used to represent text.

## What is a boolean?

One of exactly two values, `true` or `false`, used for logic and conditions.

## What is a number?

A numeric value. JavaScript has one number type that covers both integers and floats — there's no separate int/float distinction to worry about. Other languages often split this into signed/unsigned or 32-bit/64-bit variants, which makes this worth asking explicitly whenever it's not JavaScript.

## What is null?

A value that represents the intentional absence of any object value — something explicitly set to "nothing."

## What is undefined?

The value a variable has before anything's been assigned to it, or that a function returns when it doesn't explicitly return anything.

## What is an object?

A collection of key-value pairs, and the one built-in type that isn't primitive.

## What is a symbol?

A unique, immutable primitive value, most often used as a collision-free object key.

## How do you define a string?

With single quotes, double quotes, or backticks — backticks also enable template literals:

```javascript
const a = "single or double quotes"
const b = `backticks, which also allow ${a}`
```

## How do you escape a character?

With a backslash: `\"` inside a double-quoted string, or `\n` for a newline.

## How do you concatenate two strings?

With `+`, or with a template literal:

```javascript
const full = "Kyle" + " " + "Monti"
const alsoFull = `${"Kyle"} ${"Monti"}`
```

## How do you do string interpolation?

With a template literal — backticks, and `${}` around the expression to interpolate:

```javascript
const name = "Kyle"
const greeting = `Hi, ${name}`
```

## How do you define an object?

With curly braces around a list of key-value pairs:

```javascript
const person = {
	name: "Kyle",
	age: 30,
}
```

## How do you make a code block?

With curly braces `{ }` — used by functions, `if` statements, loops, and anywhere else a group of statements needs to run together.

## How do you write an if statement?

With the `if` keyword, a condition in parentheses, and a block in braces. The full family of `if`, `if/else`, and `if/else if/else` is covered in detail further down.

## Can var or let be mutated?

Yes — both can be reassigned. `const` is the one that can't be reassigned, though a `const` object or array can still have its own contents changed; `const` only locks the variable binding, not whatever it points to.

## When do you declare a variable?

As close as possible to where it's first used. JavaScript's hoisting rules are more permissive than that — `var` declarations are hoisted to the top of their function and exist (as `undefined`) before the line they're written on, while `let` and `const` are hoisted too but sit in a "temporal dead zone" and throw if read before their declaration runs. Whether this question even makes sense is worth checking per language — not every language hoists.

## When do you use var?

In modern JavaScript, essentially never. `let` and `const` cover everything `var` used to, without `var`'s quirks — it's scoped to the whole enclosing function rather than the block, and it allows silently redeclaring the same name. This one's JavaScript-specific; most languages don't have a `var`/`let` distinction at all.

## What is the variable naming convention?

camelCase.

## What is the function naming convention?

camelCase, usually starting with a verb (`getUser`, `formatDate`).

## What is the class naming convention?

PascalCase.

## What are invalid names?

Reserved words (`const`, `function`, `class`, and so on), and any name that starts with a digit. Beyond the first character, names can contain letters, digits, `_`, and `$`.

## What is the modulo operator?

`%` — it returns the remainder of a division.

```javascript
5 % 2 // 1
```

## Can you do math with strings?

Yes, but no. JavaScript coerces strings to numbers for `-`, `*`, `/`, and `%`, but `+` is overloaded for string concatenation, so it behaves differently from the rest:

```javascript
"5" - 1 // 4
"5" + 1 // "51"
```

## Why make an object?

To group related data and behavior under one name, and to look values up by key instead of remembering positional order the way an array requires. Most languages have an equivalent — a hash map, a dictionary, a struct.

## Can you sort object keys?

Not really, and not on purpose. Key order isn't arbitrary — string keys stay in insertion order, but any key that looks like an integer always sorts first, in ascending numeric order, regardless of when it was added. It's not meant to be relied on for sorting; reach for a `Map`, or sort the entries into an array, if order actually matters.

## How can you access object properties?

The same handful of ways covered in detail further down: dot notation, bracket notation, or a computed key.

## What is the syntax for JavaScript's comparison and equality operators?

- `<` less than
- `>` greater than
- `<=` less than or equal to
- `>=` greater than or equal to
- `==` equal to, with type coercion
- `!=` not equal to, with type coercion
- `===` equal to, without type coercion
- `!==` not equal to, without type coercion

See [MDN's full operator reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators) for everything else, bitwise and logical operators included.

## What is type coercion?

Automatically converting a value from one type to another — a string to a number, say — usually so an operator or comparison can proceed.

## Why make a function?

To name and reuse a piece of logic instead of repeating it, and to give that behavior a single place to change later.

## How do you define a function?

Several ways, depending on the style:

```javascript
function functionName() {} // standard declaration
const anonymousExample = function () {} // anonymous function expression
const namedExample = function functionName() {} // named function expression
const arrowExample = () => {} // arrow function
```

## How do you call a function?

By name, followed by parentheses: `functionName()`.

## How do you pass information into a function?

As arguments, listed inside the call's parentheses:

```javascript
function greet(name) {
	return `Hi, ${name}`
}
greet("Kyle")
```

## What is a parameter?

The named variable declared in a function's definition.

## What is an argument?

The actual value passed in when the function is called.

## What is the difference between a parameter and an argument?

A parameter is the variable named in the function's definition. An argument is the value passed in at the call site — the argument becomes the parameter's value inside the function.

## How do you get information out of a function?

With the `return` keyword.

## What is the Unix epoch?

The reference point most computers measure time from: midnight UTC on January 1, 1970. A timestamp is usually the number of seconds or milliseconds since then.

## How does JS track time?

In milliseconds since the Unix epoch — `Date.now()` returns that number directly.

## What's the best resource for built-in JS functions?

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects).

## What is function scope?

The rule that a variable declared inside a function is only accessible within that function.

## Are arguments passed by value or by reference?

Technically always by value — but for objects, arrays, and functions, the value being copied is a reference to the object, not the object itself, so mutating the object's contents through a parameter is visible to the caller. Reassigning the parameter itself is never visible outside the function, for any type.

## What does "passed by reference" mean?

The variable and the argument point at the same underlying value in memory, so a change made through one is visible through the other.

## How do you set a default value for a parameter?

```javascript
function greet(name = "friend") {
	return `Hi, ${name}`
}
greet() // "Hi, friend"
```

## What is hoisting?

JavaScript's habit of processing declarations before running code line by line. `var` and function declarations are hoisted to the top of their scope and are accessible (as `undefined`, for `var`) before the line they're written on. `let` and `const` are hoisted too, but stay in a "temporal dead zone" and throw a `ReferenceError` if read before their own declaration runs.

## Are arrow functions anonymous?

Yes — an arrow function has no name of its own, though JavaScript infers one from context (like the variable it's assigned to) for stack traces and `.name`.

## What is an implicit return?

An arrow function written without curly braces automatically returns the expression after the arrow, with no `return` keyword needed:

```javascript
const double = (n) => n * 2
```

## What is an immediately invoked function expression?

A function defined and called in the same expression, often used to create an isolated scope:

```javascript
;(function () {
	console.log("runs immediately")
})()
```

## What is a callback function?

A function passed into another function as an argument, to be called at some later point — after an operation finishes, once per array item, or on some other trigger.

## What is scope?

The region of code where a given variable is accessible.

## What is a global variable?

A variable accessible from anywhere in the program, declared outside every function and block.

## Should you make global variables?

Generally, no. They make code harder to reason about and are prone to naming collisions. Keep a variable as narrowly scoped as the code that actually needs it.

## Can a function access a variable in the parent scope?

Yes, through a closure — a function can read (and, if it's not `const`, reassign) any variable declared in a scope that contains it.

## What is block scope?

A variable declared with `let` or `const` inside `{ }` — an `if` block, a loop, any block — is only accessible within that block. `var` doesn't respect this; it's scoped to the whole enclosing function instead.

## When a function looks outside its scope, does it look where it is called or where it is defined?

Where it's defined — this is called lexical (or static) scoping. `this` is the one notable exception, since its value usually depends on how a regular function is called, not where it's written.

## What is a closure?

A function that remembers the variables from the scope it was created in, even after that outer scope has finished running. It doesn't have to be returned from another function to count — any function that references an outer variable and outlives that scope's usual lifetime (a callback, an event handler, a timer) is a closure. Returning one from another function is just the clearest way to demonstrate it:

```javascript
function makeCounter() {
	let count = 0
	return function () {
		count += 1
		return count
	}
}
const counter = makeCounter()
counter() // 1
counter() // 2
```

## What are the order of operations?

Parentheses, exponents, multiplication, division, addition, and subtraction — the same as in mathematics.

## What is the operator for each of those?

- `()` parentheses
- `**` exponents
- `*` multiplication
- `/` division
- `+` addition
- `-` subtraction

See [MDN's operator precedence table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators) for the complete list.

## What is an if statement?

A statement that conditionally runs a block of code — only when its condition evaluates to a truthy value.

## What is an else statement?

It pairs with an `if` statement as the block that runs when the condition is false.

## Show the syntax for `if`, `if/else`, and `if/else if/else`

```javascript
if (condition) {
	// runs if condition is true
}

if (condition) {
	// runs if condition is true
} else {
	// runs if condition is false
}

if (condition) {
	// runs if condition is true
} else if (secondCondition) {
	// runs if condition is false and secondCondition is true
} else {
	// runs if both condition and secondCondition are false
}
```

## What is the logical and?

Like in math, `&&` returns `true` only when both sides evaluate to true — if either side is false, so is the whole expression.

It also short-circuits: if the left side is falsy, JavaScript never evaluates the right side at all.

## What is the logical or?

Also like in math, `||` returns `true` if either side evaluates to true, and only returns `false` when both sides do.

## What is truthy?

Shorthand for any value that gets coerced to `true` in a boolean context — which is everything except the falsy values listed below, including every object and array, even empty ones (`{}` and `[]` are both truthy).

## What is falsy?

Shorthand for the short list of values that get coerced to `false`: `false` itself, `0` (and `-0`), `""` (an empty string), `null`, `undefined`, `NaN`, and `0n` (BigInt zero).

## What expressions can be used for the conditional in an if statement?

Any expression — it just needs to evaluate to something truthy or falsy. JavaScript doesn't require a literal boolean.

## What is coercion?

Converting a value from one type to another, either explicitly (`Number("5")`) or automatically, the way JavaScript does for operators like `-`, `*`, and `==`.

## What is a ternary?

A shorthand `if/else`, written as `condition ? valueIfTrue : valueIfFalse`. Since it's an expression rather than a statement, it has to produce a value — through `return`, an assignment, interpolation, or as a value passed somewhere else — never sitting on its own line the way a full `if/else` can.

```javascript
const status = isLoggedIn ? "Welcome back" : "Please sign in"
```

## What is the `&&` shortcut?

When the left side of `&&` is truthy, the whole expression evaluates to the right side — not just `true`. That gets used to run something conditionally without a full `if` statement:

```javascript
true && someFunction() // someFunction runs, since the left side is truthy

const variableName = true && someGetter()
// variableName is set to whatever someGetter() returns
```

## What is a switch statement?

The honest answer is I mostly know when to reach for one: once there are three or more `if`/`else if` blocks, especially if some of them should run the same code, and every condition can be checked with `===`, a switch statement is usually the cleaner choice.

## What is the syntax for a switch statement?

```javascript
switch (variableToCheck) {
	case possibleValue:
		doSomething()
		break // without break, the following cases run too — this is called fallthrough
	case anotherPossibleValue:
	case yetAnotherPossibleValue:
		doAnotherThing() // both of the above cases run this code
		break
	default:
		doDefaultThing() // runs if none of the cases match
}
```

## How do you delay code execution for a set amount of time?

With the built-in `setTimeout` function.

## How do you repeatedly execute a block of code on an interval?

With the built-in `setInterval` function — it keeps running until it's stopped with `clearInterval`.

## What is the syntax for setTimeout?

There's more to it than this shows — see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) for the rest.

```javascript
setTimeout(function () {}, delayTimeInMilliseconds)
```

## What is the syntax for setInterval?

Again, there's more than this snippet shows — see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) for the rest.

```javascript
setInterval(function () {}, delayTimeInMilliseconds)
```

## Can you control the order of properties in an object?

Not directly. String keys keep insertion order, but any key that looks like an integer always comes first, in ascending numeric order, regardless of when it was added — you don't get to arbitrarily reorder either group.

## What kind of values can be stored as an object's values?

Anything — any type at all, including other objects, arrays, or functions.

## What kind of values can be used as an object's keys?

Only strings and symbols. Write a number as a key and JavaScript quietly converts it to a string.

## How do you prevent object mutation?

```javascript
const objectVariable = {
	has: "values",
}
Object.freeze(objectVariable)
```

This is a shallow freeze — a nested object inside `objectVariable` can still be mutated.

## How can you access properties in an object?

Several ways:

```javascript
const variable = {
	prop: true,
}
variable.prop
variable["prop"]
const p = "prop"
variable[p]
function get() {
	return "prop"
}
variable[get()]
```

## How do you access a deeply nested property?

The same techniques, chained together:

```javascript
const variable = {
	prop: {
		anotherProp: {
			"a-third-prop": true,
		},
	},
}
variable.prop.anotherProp["a-third-prop"]
variable["prop"]["anotherProp"]["a-third-prop"]
const p = "prop"
variable[p].anotherProp["a-third-prop"]
function get() {
	return "prop"
}
function what() {
	return "third"
}
variable[get()].anotherProp[`a-${what()}-prop`]
```

## How do you remove a property from an object?

With the `delete` keyword.

```javascript
const variable = {
	prop: "something",
}
delete variable.prop
```

## How do you add a property to an object?

You assign it a value.

```javascript
const variable = {}

variable.prop = null
variable["another prop"] = null
// and so on
```

## What is a method?

In JavaScript, a method is just a function stored as a property on an object. In most other languages, the equivalent concept is a function defined inside a class.

```javascript
const variable = {
	method: function () {
		return "I'm a method."
	},
}
```

## What is this?

`this` is a reference to the context a method is called in — with many, many caveats. In the snippet below, `this` refers to the object the method was called on.

```javascript
const variable = {
	prop: true,
	method: function () {
		return this.prop ? "Hi" : "Bye"
	},
}
variable.method() // "Hi"
variable.prop = false
variable.method() // "Bye"
```

## Do arrow functions have their own this?

No. In the snippet below, because the arrow function doesn't scope its own `this`, `this` is inherited from the parent instead:

```javascript
const parentVariable = {
	name: "Kyle",
	prop: function () {
		return {
			name: "Tyler",
			method: () => {
				return `Hi ${this.name}`
			},
		}
	},
}
parentVariable.prop().method() // "Hi Kyle", because this is inherited
```

## What is assignment by value?

When a variable is assigned a value by value, a chunk of memory gets allocated and populated with that value — the variable owns that memory directly.

## What is assignment by reference?

When a variable is assigned a value by reference, no new memory gets allocated for the value itself — the variable just points at an existing chunk of memory. Modifying that memory through any variable pointing to it affects every other variable pointing to the same place.

## How are objects compared with the `===` operator?

They're compared by reference, not by value. If two basic objects need comparing by their contents, the easiest way is this:

```javascript
const doesMatch = JSON.stringify(object1) === JSON.stringify(object2)
```

This turns both objects into strings, making them easy to compare. The catch: it only works if both objects were built with their properties in the same order, and only for values JSON can represent — a function or an `undefined` property gets silently dropped by `JSON.stringify`, and an object with a circular reference throws instead of stringifying at all.

## How do you copy an object by reference?

Using the assignment operator.

```javascript
const newObject = oldObject
```

## How do you copy an object by value?

There are a few strategies for this one, and they get a little weird.

The first is the old-school [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

```javascript
const someObject = {
	has: "properties",
	and: { also: { has: { deeply: { nested: { values: 1 } } } } },
}
const otherObject = Object.assign({}, someObject)
```

This copies every enumerable own property from the second argument onto the first. Making the first argument an empty object is what turns this into a clean copy rather than a merge.

The second way is the spread operator.

```javascript
const someObject = {
	has: "properties",
	and: { also: { has: { deeply: { nested: { values: 1 } } } } },
}
const otherObject = { ...someObject }
```

Both of these first two approaches share the same limitation: only the first level of properties is copied by value. Everything nested past that first level is still copied by reference, so mutating a nested object on the copy also mutates it on the original.

The third way is a little silly, but works: stringify the source object, then parse it back into a new one.

```javascript
const someObject = {
	has: "properties",
	and: { also: { has: { deeply: { nested: { values: 1 } } } } },
}
const otherObject = JSON.parse(JSON.stringify(someObject))
```

This produces a genuine deep copy, but only for values JSON can represent — functions, `undefined`, and symbols get dropped, and something like a `Date` gets silently turned into a string. It's not a general-purpose deep clone, just a usable one for plain data.

## How are objects passed to functions?

By reference, in the sense that the function receives a reference to the same underlying object rather than a copy of it — mutating the object inside the function is visible outside, but reassigning the parameter itself is not. This is why it's worth avoiding reassigning or mutating a parameter unless that's the explicit point.

## What is a Map?

A `Map` object holds key-value pairs _in order_, where both keys and values can be any type, including objects.

## What is JSON?

JSON — JavaScript Object Notation — is the string representation of a plain JavaScript object.

```javascript
const someObject = {
	has: "values",
}
const string = JSON.stringify(someObject) // '{"has":"values"}'
```

## What is an array?

An ordered collection of values.

## How do you access an item in an array?

With the item's index.

```javascript
const fruits = ["apple", "banana", "cherry"]
fruits[1] // "banana"
```

## What is the index?

The position of an item in an array.

## What is the index of the first item in an array?

`0`. Arrays start at zero.

## How do you get the length of an array?

With the `length` property.

```javascript
const fruits = ["apple", "banana", "cherry"]
fruits.length // 3
```

## What can you put in an array?

Anything — numbers, strings, other arrays, objects, functions. Arrays don't discriminate by type.

## How do you make an array?

```javascript
// literal
const fruits = ["apple", "banana"]
const animals = new Array("monkey", "dog")
```

## Does an array have keys?

No — just numeric indices. Arrays are objects underneath, so it's technically possible to bolt an arbitrary property onto one, but nothing built-in treats that as a real array element, and it's not something to rely on.

## What primitive type is an array?

It's not primitive at all — under the hood, an array is just an object with numeric keys and some extra built-in methods.

## Where can you find the syntax for all the array methods?

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

## Are any array methods destructive (do they mutate the array they're called on)?

Yes — some array methods mutate the array in place, and some return a new array while leaving the original untouched. MDN notes which is which for every method; it's worth checking whenever a specific one is unfamiliar.

## How do you use a destructive method without mutating the original variable?

Copy the original variable first.

```javascript
const fruits = ["apple", "banana"]
const newFruits = [...fruits].reverse() // ["banana", "apple"]
```

## How do you add an item to an array?

With the `push` method.

```javascript
const fruits = ["apple", "banana"]
fruits.push("mango")
console.log(fruits) // ["apple", "banana", "mango"]
```

## Is push destructive?

Yes — it mutates the array in place, and returns the array's new length rather than the array itself.

## How do you add an item to the beginning of an array?

With the `unshift` method. Why "unshift"? Because `shift` removes the first element.

```javascript
const fruits = ["apple", "banana"]
fruits.unshift("mango")
console.log(fruits) // ["mango", "apple", "banana"]
```

## What does slice do?

Returns a shallow copy of a portion of an array, without mutating the original.

## What does splice do?

Removes, replaces, or inserts a portion of an array in place. See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) for the full signature.

## How do you add an item in the middle?

With `splice`, or with strategic copying:

```javascript
const fruits = ["apple", "banana"]
fruits.splice(1, 0, "mango")
console.log(fruits) // ["apple", "mango", "banana"]
// OR
const fruits = ["apple", "banana"]
const newFruits = [...fruits.slice(0, 1), "mango", ...fruits.slice(1)]
```

The first is destructive — the original variable is mutated. The second is not.

## How do you remove an item in the middle?

With `splice`, or with strategic copying:

```javascript
const fruits = ["apple", "mango", "banana"]
fruits.splice(1, 1)
console.log(fruits) // ["apple", "banana"]
// OR
const fruits = ["apple", "mango", "banana"]
const newFruits = [...fruits.slice(0, 1), ...fruits.slice(2)]
```

The first is destructive because the variable is mutated. The second isn't.

## How do you destructure an array?

```javascript
const fruits = ["apple", "mango", "banana"]
const [apple, mango, ...other] = fruits
console.log(apple) // "apple"
console.log(mango) // "mango"
console.log(other) // ["banana"]
```

The last one isn't required — it's just an example of how to collect the remaining entries.

## How do you destructure an object?

```javascript
const fruits = {
	apple: "red",
	mango: "orange",
	banana: "yellow",
	peach: "pink",
}
const { apple, mango, ...other } = fruits
console.log(apple) // "red"
console.log(mango) // "orange"
console.log(other) // { banana: "yellow", peach: "pink" }
```

The last one isn't required either — same idea, collecting the rest.

## How do you find the index of an item in an array?

```javascript
const fruits = ["apple", "mango", "banana", "peach", "eggplant", "taco", "taco"]
const isTacoFruit = fruits.includes("taco") // true, tacos are life
const tacoIndex = fruits.indexOf("taco") // 5
const lastTaco = fruits.lastIndexOf("taco") // 6
const tacoIndexHunt = fruits.findIndex((fruit) => fruit === "taco") // 5
const tacoHunt = fruits.find((fruit) => fruit === "taco") // "taco"
```

Some of these don't return an index at all — they return the matching entry instead. That covers every array search method except `filter`, `map`, `every`, `forEach`, `reduce`, `reduceRight`, and `sort`.

## How do you reverse the order of an array?

There's really only one way, and it's destructive — but an extra step saves the original if that matters:

```javascript
// destructive
const fruits = ["apple", "mango", "banana", "peach", "eggplant"]
fruits.reverse() // ["eggplant", "peach", "banana", "mango", "apple"]

// non-destructive
const fruits = ["apple", "mango", "banana", "peach", "eggplant"]
const newFruits = [...fruits].reverse() // ["eggplant", "peach", "banana", "mango", "apple"]
```

## What is a factory function?

A function that returns another function — worth naming carefully so it doesn't get confused with a JavaScript generator function (`function*`/`yield`), which is a different, unrelated feature.

```javascript
function findByFood(searchTerm) {
	return function (entry) {
		return entry.food.includes(searchTerm)
	}
}
const menu = [{ food: ["apple", "mango", "banana", "peach", "eggplant"] }, { food: ["burger", "popcorn"] }]
const findApple = findByFood("apple")
const match = menu.find(findApple) // { food: ["apple", "mango", "banana", "peach", "eggplant"] }
```

## How do you loop through all the items in an array?

There are a lot of ways to do this — probably more than the question really accounts for, but arrays narrow it down some. For arrays specifically:

- `map`
- `forEach`
- a standard `for` loop
- [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

```javascript
const fruits = ["apple", "mango", "banana", "peach", "eggplant"]

// map - returns a new array, takes a callback function as an argument
const mapTurtles = fruits.map((fruit) => `${fruit}-turtle`)
console.log(mapTurtles) // ["apple-turtle", "mango-turtle", "banana-turtle", "peach-turtle", "eggplant-turtle"]

// forEach - returns undefined, takes a callback function as an argument
const forEachTurtles = []
fruits.forEach((fruit) => {
	forEachTurtles.push(`${fruit}-turtle`)
})
console.log(forEachTurtles) // ["apple-turtle", "mango-turtle", "banana-turtle", "peach-turtle", "eggplant-turtle"]

// standard for loop
const forLoopTurtles = []
for (let i = 0; i < fruits.length; i++) {
	forLoopTurtles.push(`${fruits[i]}-turtle`)
}
console.log(forLoopTurtles) // ["apple-turtle", "mango-turtle", "banana-turtle", "peach-turtle", "eggplant-turtle"]

// for...of
for (const fruit of fruits) {
	console.log(fruit) // "apple"
}
```

## How do you loop through all the items in an object?

The first thing to do is turn the object into something iterable — plain objects generally aren't. That means you can't iterate over key-value pairs the way you can iterate over an array's index-value pairs without going through one of these first:

- [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
- [`for...in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)

```javascript
const fruits = {
	apple: "red",
	mango: "orange",
	banana: "yellow",
	peach: "pink",
	eggplant: "purple",
}

// Object.entries
const entries = Object.entries(fruits)
// [["apple", "red"], ["mango", "orange"], ["banana", "yellow"], ...]
// shortened with array destructuring:
for (const [key, value] of Object.entries(fruits)) {
	console.log(key) // "apple"
	console.log(value) // "red"
}

// Object.keys
const keys = Object.keys(fruits) // ["apple", "mango", ...]
keys.map((key) => {
	const value = fruits[key]
	console.log(key) // "apple"
	console.log(value) // "red"
})

// Object.values
const values = Object.values(fruits) // ["red", "orange", "yellow", "pink", "purple"]

// for...in
for (const property in fruits) {
	console.log(property) // "apple"
	const value = fruits[property]
	console.log(value) // "red"
}
```
