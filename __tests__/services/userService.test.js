const userService = require('../../services/userService');

test('createUser should return a user object', () => {
    const user = userService.createUser('John Doe', 'john@example.com');
    expect(user).toEqual({ name: 'John Doe', email: 'john@example.com' });
});

test('getUser should return a user by ID', () => {
    const user = userService.createUser('Jane Doe', 'jane@example.com');
    const fetchedUser = userService.getUser(user.id);
    expect(fetchedUser).toEqual(user);
});

test('updateUser should modify the user details', () => {
    const user = userService.createUser('John Doe', 'john@example.com');
    const updatedUser = userService.updateUser(user.id, { email: 'john.doe@example.com' });
    expect(updatedUser.email).toBe('john.doe@example.com');
});

test('deleteUser should remove the user', () => {
    const user = userService.createUser('John Doe', 'john@example.com');
    userService.deleteUser(user.id);
    const deletedUser = userService.getUser(user.id);
    expect(deletedUser).toBeUndefined();
});