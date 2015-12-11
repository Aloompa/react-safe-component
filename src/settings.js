let settings = {
    errorMessage: 'Oops... an error has occured'
};

const set = (field, value) => {
    settings[field] = value;
};

const get = (field) => {
    return settings[field];
};

module.exports = {
    set, get
};
