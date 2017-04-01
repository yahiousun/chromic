import TaskScheduler from './task_scheduler';

export { default as TaskType } from './task_type';

const TaskService: TaskScheduler = new TaskScheduler();

export default TaskService;
