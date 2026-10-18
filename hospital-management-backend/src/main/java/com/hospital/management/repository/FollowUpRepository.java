package com.hospital.management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.FollowUp;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByPatientId(Long patientId);

    List<FollowUp> findByFollowUpDateGreaterThanEqual(LocalDate date);
}
