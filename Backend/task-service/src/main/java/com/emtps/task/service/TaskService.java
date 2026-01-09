package com.emtps.task.service;

import com.emtps.task.model.Task;
import com.emtps.task.model.Status;
import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    List<Task> getAllTasks();
    List<Task> getTasksByAssignee(String userId);
    List<Task> getTasksByAssigner(String managerId);
    Task updateTaskStatus(Long taskId, Status status, String remark);
    Task updateTask(Long taskId, Task taskDetails);
    void deleteTask(Long taskId);
}
