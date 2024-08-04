const units = {
    s: 1000,         // seconds to milliseconds
    m: 1000 * 60,    // minutes to milliseconds
    h: 1000 * 60 * 60, // hours to milliseconds
    d: 1000 * 60 * 60 * 24, // days to milliseconds
    w: 1000 * 60 * 60 * 24 * 7 // weeks to milliseconds
};

function convert(timeString) {
    const regex = /^(\d+)([smhdw])$/; // regex to match the format "number + unit"
    const match = timeString.match(regex);

    if (!match) {
        throw new Error('Invalid time string format');
    }

    const value = parseInt(match[1], 10); // the numeric part of the time string
    const unit = match[2]; // the unit part of the time string

    if (!units[unit]) {
        throw new Error('Unknown time unit');
    }

    return value * units[unit];
}

module.exports = convert;
