const wrap = require('./wrap');
const settings = require('./settings');

module.exports = {
    configure: settings.get,
    wrap: wrap
};
