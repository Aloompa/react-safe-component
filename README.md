## Welcome to react-safe-component

React is very unforgiving about errors occurring on the lifecycle methods. You may find that your app totally crashes and you are unable to navigate to new routes. That's where safe component comes in. Just wrap your uninstantiated component and we will catch and log any errors so your app keeps working even when there is a bug.

## Installation

`npm install react-safe-component`

## Usage

Just wrap your uninstantiated class in a safeComponent function, and any of your lifecycle methods can throw errors without crashing your app.

```
const React = require('react');
const safeComponent = require('react-safe-component');

class MyAwesomeComponent extends React.Component {

    componentWillMount () {
        throw new Error('Oh no! My componentWillMount method broke. I guess my app will totally crash now...'');
    }

    render () {
        return (
            <div>What? How am I still rendering? Is it magic?</div>
        );
    }

}

module.exports = safeComponent(MyAwesomeComponent);
```

The render() method is sort of a special animal because it expects there to be an output to render. By default, we return an error message, but you can customize it using the `renderSafeComponentError()` method on your component.

```
const React = require('react');
const safeComponent = require('react-safe-component');

class MyAwesomeComponent extends React.Component {

    renderSafeComponentError () {
        return (
            <div>Failure</div>
        );
    }

    render () {
        throw new Error('Dangit');

        return (
            <div>Success</div>
        );
    }

}

module.exports = safeComponent(MyAwesomeComponent);
```

## Debugging errors

Since the errors get caught, the only way to see them is to turn on debugging. This can be done by adding a setting to your localStorage:

`localStorage.debug = 'react-safe-component';`

## Contributing

We encourage you to contribute to react-safe-component by submitting bug reports and pull requests through [Github](http://github.com).

## License

react-safe-component is released under The [MIT License](http://www.opensource.org/licenses/MIT) (MIT)

Copyright (c) [2015] [Aloompa LLC]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
