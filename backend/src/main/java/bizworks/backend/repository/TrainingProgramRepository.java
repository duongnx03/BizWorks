package com.example.bizwebsite.repositories;

import com.example.bizwebsite.models.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {

    Optional<TrainingProgram> findByProgramName(String programName);
}
