import React from 'react';
import lifeCycleMethods from './lifeCycleMethods';
import { ErrorMessage } from './components';
import {
  isFunctionalComponent,
  isClassComponent,
} from './utils';

const debug = require('debug')('react-safe-component');

function wrapClassComponent(Component) {
  if (!Component.prototype.renderSafeComponentError) {
    // eslint-disable-next-line no-param-reassign
    Component.prototype.renderSafeComponentError = ErrorMessage;
  }

  const wrapMethod = (methodName) => {
    const originalMethod = Component.prototype[methodName];

    if (!originalMethod) {
      return;
    }

    // eslint-disable-next-line no-param-reassign,consistent-return,func-names
    Component.prototype[methodName] = function (...args) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        debug(error);

        if (methodName === 'render') {
          return React.createElement(Component.prototype.renderSafeComponentError.call(this));
        }

        if (methodName === 'shouldComponentUpdate') {
          return false;
        }
      }
    };
  };

  lifeCycleMethods.forEach(wrapMethod);

  return Component;
}

function wrapFunctionalComponent(functionalComponent) {
  return function safelyWrappedFunctionalComponent(...args) {
    try {
      return functionalComponent(...args);
    } catch (error) {
      debug(error);
      return React.createElement(
        ErrorMessage,
      );
    }
  };
}

function wrap(Component) {
  if (isClassComponent(Component)) {
    return wrapClassComponent(Component);
  }
  if (isFunctionalComponent(Component)) {
    return wrapFunctionalComponent(Component);
  }
  debug('I have no component to wrap 😱');
  return Component;
}


export default wrap;
