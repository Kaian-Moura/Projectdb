const User = require('../../models/User');

describe('User Model', () => {
	test('should create a user with valid properties', () => {
		const user = new User({ name: 'John Doe', email: 'john@example.com' });
		expect(user.name).toBe('John Doe');
		expect(user.email).toBe('john@example.com');
	});

	test('should throw an error if name is missing', () => {
		expect(() => new User({ email: 'john@example.com' })).toThrow();
	});

	test('should throw an error if email is missing', () => {
		expect(() => new User({ name: 'John Doe' })).toThrow();
	});

	test('should return full name when getFullName is called', () => {
		const user = new User({ firstName: 'John', lastName: 'Doe' });
		expect(user.getFullName()).toBe('John Doe');
	});
});