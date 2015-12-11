const wrap = require('../index');
const lifeCycleMethods = require('../lifeCycleMethods');
const assert = require('assert');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');

class EmptyMockComponent extends React.Component {}
class GoodMockComponent extends React.Component {}
class BadMockComponent extends React.Component {}

lifeCycleMethods.forEach((methodName) => {
    GoodMockComponent.prototype[methodName] = (first, second) => {
        return first + second;
    };

    BadMockComponent.prototype[methodName] = () => {
        throw new Error(`${methodName} Error`);
    };
});

describe('The react-safe-component Test Suite', () => {
    lifeCycleMethods.forEach((methodName) => {
        describe(`When we get wrap the ${methodName}() method`, () => {
            it('Should instantiate with the original arguments', () => {
                const Component = wrap(GoodMockComponent);
                const component = new Component();
                const value = component[methodName]('foo', 'bar');

                assert.equal(value, 'foobar');
            });

            it('Should not throw an error if there is one', () => {
                const Component = wrap(BadMockComponent);
                const component = new Component();

                assert.doesNotThrow(component[methodName], Error);
            });

            it('Should not stub the method if it does not exist', () => {
                const Component = wrap(EmptyMockComponent);
                const component = new Component();

                assert.ok(!component[methodName]);
            });

            if (methodName === 'shouldComponentUpdate') {
                it('Should return a boolean for componentShouldUpdate on error', () => {
                    const Component = wrap(BadMockComponent);
                    const component = new Component();

                    assert.equal(typeof component[methodName](), 'boolean');
                });
            }

            if (methodName === 'render') {
                it('Should return a message wrapped in a react element if there is an error', () => {
                    const Component = wrap(BadMockComponent);
                    const renderer = ReactTestUtils.createRenderer();

                    renderer.render(
                        React.createElement(Component)
                    );

                    const { props } = renderer.getRenderOutput();

                    assert.equal(props.className, 'react__safecomponent-error');
                    assert.equal(props.children, 'Oops... an error has occured');
                });

                it('Should return a custom error', () => {
                    BadMockComponent.prototype.renderSafeComponentError = () => {
                        return 'Custom Error!';
                    };

                    const Component = wrap(BadMockComponent);
                    const renderer = ReactTestUtils.createRenderer();

                    renderer.render(
                        React.createElement(Component)
                    );

                    const { props } = renderer.getRenderOutput();

                    assert.equal(props.className, 'react__safecomponent-error');
                    assert.equal(props.children, 'Custom Error!');
                });
            }
        });
    });
});
