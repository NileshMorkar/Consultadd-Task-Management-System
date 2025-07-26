package com.taskManagement.project.repository;

import com.taskManagement.project.model.Status;
import com.taskManagement.project.model.Status.StatusName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Integer> {
    Optional<Status> findByName(StatusName name);
}
