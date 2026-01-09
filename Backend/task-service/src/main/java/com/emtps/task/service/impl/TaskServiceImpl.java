package com.emtps.task.service.impl;

import com.emtps.task.model.Task;
import com.emtps.task.model.Status;
import com.emtps.task.repository.TaskRepository;
import com.emtps.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getTasksByAssignee(String userId) {
        return taskRepository.findByAssignedTo(userId);
    }

    @Override
    public List<Task> getTasksByAssigner(String managerId) {
        return taskRepository.findByAssignedBy(managerId);
    }

    @Override
    @Transactional
    public Task updateTaskStatus(Long taskId, Status status, String remark) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        if (remark != null) {
            task.setLastRemark(remark);
        }
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setPriority(taskDetails.getPriority());
        task.setDeadline(taskDetails.getDeadline());
        task.setStatus(taskDetails.getStatus());
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
