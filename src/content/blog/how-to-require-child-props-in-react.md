---
title: How to require child props in React
date: 2019-05-06
excerpt: PropTypes for the case where a component's child must be one or more HTML elements.
tags: React, PropTypes
---

![How to require child props in React](/img/how-to-require-child-props-in-react.png)

A component whose child must be one or more HTML elements needs its own prop type for that — here's how to set it up.

```javascript
static propTypes = {
	children: PropTypes.node.isRequired,
}
```

Or:

```javascript
static propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
}
```

The first requires a single node as the component's child. The second requires one or more nodes.

## Resources

- [Stack Overflow](https://stackoverflow.com/questions/42122522/reactjs-what-should-the-proptypes-be-for-this-props-children)
- [React documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
