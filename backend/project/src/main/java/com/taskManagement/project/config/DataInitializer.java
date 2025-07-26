package com.taskManagement.project.config;

import com.taskManagement.project.model.Status;
import com.taskManagement.project.model.Status.StatusName;
import com.taskManagement.project.repository.StatusRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final StatusRepository statusRepository;

    @PostConstruct
    public void initStatuses() {
        Status[] defaultStatuses = {
                new Status(1, StatusName.TODO),
                new Status(2, StatusName.IN_PROGRESS),
                new Status(3, StatusName.DONE)
        };

        for (Status status : defaultStatuses) {
            if (!statusRepository.existsById(status.getId())) {
                statusRepository.save(status);
            }
        }
    }
}

