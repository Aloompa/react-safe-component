const React = require('react');
const lifeCycleMethods = require('./lifeCycleMethods');

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
                if (methodName === 'render') {
                    return React.createElement('div', {
                        className: 'react__safecomponent-error'
                    }, Component.prototype.renderSafeComponentError());
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
