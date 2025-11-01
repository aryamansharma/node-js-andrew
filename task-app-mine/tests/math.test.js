const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../math');

test('Should calcualte total with tip percent', () => {
    const total = calculateTip(10, 30);
    // this is the expect API provided by jest to make assertions(validations) like we are doing below
    expect(total).toBe(13); // this line will throw an error if this entire expression return false
});

test('Should calcualte total with default tip percent', () => {
    const total = calculateTip(10);
    expect(total).toBe(12);
});

test('should convert from fahrenheit to celsius', () => {
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0);
});

test('should convert from celsius to fahrenheit', () => {
    const temp = celsiusToFahrenheit(0);
    expect(temp).toBe(32);
});