import { useCallback, useContext, useMemo } from 'react';
import { StudyContext } from '../context/StudyContext';

const useTasks = () => {
	const { tasks, addTask, updateTask, deleteTask } = useContext(StudyContext);

	const createTask = useCallback(
		(task) => {
			addTask(task);
		},
		[addTask]
	);

	const updateTaskData = useCallback(
		(id, updates) => {
			updateTask(id, updates);
		},
		[updateTask]
	);

	const deleteTaskData = useCallback(
		(id) => {
			deleteTask(id);
		},
		[deleteTask]
	);

	const getTasksByStatus = useCallback(
		(status) => tasks.filter((task) => task.status === status),
		[tasks]
	);

	const getOverdueTasks = useCallback(() => {
		const now = new Date();
		return tasks.filter((task) => {
			if (!task?.deadline || task?.status === 'Completed') return false;
			const deadlineDate = new Date(task.deadline);
			if (Number.isNaN(deadlineDate.getTime())) return false;
			return deadlineDate < now;
		});
	}, [tasks]);

	const taskSummary = useMemo(() => {
		const completed = tasks.filter((task) => task.status === 'Completed').length;
		const pending = tasks.filter((task) => task.status === 'Pending').length;
		const revision = tasks.filter((task) => task.status === 'Revision').length;

		return {
			total: tasks.length,
			completed,
			pending,
			revision,
			overdue: getOverdueTasks().length,
		};
	}, [tasks, getOverdueTasks]);

	return {
		tasks,
		taskSummary,
		createTask,
		updateTaskData,
		deleteTaskData,
		getTasksByStatus,
		getOverdueTasks,
	};
};

export default useTasks;
