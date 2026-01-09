package com.emtps.task.repository;

import com.emtps.task.model.Task;
import com.emtps.task.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(String assignedTo);
    List<Task> findByAssignedBy(String assignedBy);
    List<Task> findByStatus(Status status);
}
