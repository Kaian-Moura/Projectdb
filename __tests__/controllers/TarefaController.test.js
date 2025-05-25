const TarefaController = require('../../controllers/TarefaController');

describe('TarefaController', () => {
	test('should create a new task', () => {
		const task = TarefaController.createTask('New Task');
		expect(task).toEqual({ id: expect.any(Number), name: 'New Task' });
	});

	test('should retrieve a task by id', () => {
		const task = TarefaController.getTask(1);
		expect(task).toEqual({ id: 1, name: 'Existing Task' });
	});

	test('should update a task', () => {
		const updatedTask = TarefaController.updateTask(1, 'Updated Task');
		expect(updatedTask).toEqual({ id: 1, name: 'Updated Task' });
	});

	test('should delete a task', () => {
		const result = TarefaController.deleteTask(1);
		expect(result).toBe(true);
	});
});