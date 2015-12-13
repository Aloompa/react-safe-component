const React = require('react');
const lifeCycleMethods = require('./lifeCycleMethods');
const debug = require('debug')('react-safe-component');

const wrap = (Component) => {

    if (!Component.prototype.renderSafeComponentError) {
        Component.prototype.renderSafeComponentError = function () {
            return 'Oops... an error has occured';
        };
    }

    const wrapMethod = (methodName) => {
        const originalMethod = Component.prototype[methodName];

        if (!originalMethod) {
            return;
        }

        Component.prototype[methodName] = function () {
            try {
                return originalMethod.apply(this, arguments);

            } catch (e) {
                debug(e);

                if (methodName === 'render') {
                    return React.createElement('div', {
                        className: 'react__safecomponent-error'
                    }, Component.prototype.renderSafeComponentError.call(this));
                }

                if (methodName === 'shouldComponentUpdate') {
                    return false;
                }
            }
        };
    };

    lifeCycleMethods.forEach(wrapMethod);

    return Component;
};

module.exports = wrap;
