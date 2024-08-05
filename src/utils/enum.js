class Enum {
    constructor(...keys) {
        keys.forEach(key => {
            this[key] = key;
        });
        this._values = keys;
        Object.freeze(this);
    }

    static create(...keys) {
        return new Enum(...keys);
    }

    exists(key) {
        return this._values.includes(key);
    }

    toString() {
        return this._values.join(', ');
    }

    valueOf() {
        return this._values;
    }

    toJSON() {
        return this._values;
    }

    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => ({
                value: this._values[index],
                done: index++ >= this._values.length
            })
        };
    }

    values() {
        return this._values.slice();
    }

    // Override the inspect method for console.log
    [require('util').inspect.custom]() {
        return this._values;
    }
}

module.exports = Enum;
