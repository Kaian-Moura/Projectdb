describe('HomeController', () => {
	test('should return home page', () => {
		const response = HomeController.getHomePage();
		expect(response).toBe('Home Page');
	});

	test('should handle invalid requests', () => {
		const response = HomeController.handleInvalidRequest();
		expect(response).toBe('Invalid Request');
	});
});