/* eslint-disable react/prefer-stateless-function,react/no-multi-comp,no-undef */
import assert from 'assert';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestRenderer from 'react-test-renderer';
import lifeCycleMethods from '../lifeCycleMethods';
import wrap from '../index';
import { ErrorMessage } from '../components';

function FunctionalComponent() {
  throw new Error('Oops!');
}

class EmptyMockComponent extends React.Component {}
class GoodMockComponent extends React.Component {}
class BadMockComponent extends React.Component {}
// eslint-disable-next-line react/require-render-return
class ContextComponent extends React.Component {
  componentWillMount() {
    return this.isInContext();
  }

  isInContext() {
    return 'yes';
  }

  renderSafeComponentError() {
    return 'very yes';
  }

  render() {
    throw new Error('Oops!');
  }
}

lifeCycleMethods.forEach((methodName) => {
  GoodMockComponent.prototype[methodName] = (first, second) => first + second;

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
          const errorMessageElement = new ShallowRenderer().render(<ErrorMessage />);
          const componentElement = new ShallowRenderer().render(<Component />);
          assert.deepEqual(errorMessageElement, componentElement.type);
        });

        it('Should return a custom error', () => {
          BadMockComponent.prototype.renderSafeComponentError = () => 'Custom Error!';

          const Component = wrap(BadMockComponent);
          const errorMessageElement = new ShallowRenderer()
            .render(<BadMockComponent.prototype.renderSafeComponentError />);

          const componentElement = new ShallowRenderer().render(<Component />);

          assert.deepEqual(errorMessageElement, componentElement.type);
        });
      }
    });

    describe('When we check the context of a method', () => {
      it('Should be in the original context', () => {
        const Component = wrap(ContextComponent);
        const component = new Component();

        assert.equal(component.componentWillMount(), 'yes');
      });

      it('Should render the error method in the original context', () => {
        const Component = wrap(ContextComponent);
        const component = new Component();

        assert.equal(component.render().type, 'very yes');
      });
    });
  });
});

describe('When we pass a functional component', () => {
  it('Should return default ErrorMessage component', () => {
    const Component = wrap(FunctionalComponent);
    const componentElement = TestRenderer.create(<Component />);
    const errorMessageElement = TestRenderer.create(<ErrorMessage />);

    assert.deepEqual(componentElement.toJSON(), errorMessageElement.toJSON());
  });
});
