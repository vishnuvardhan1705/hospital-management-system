package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.NursingNote;

public interface NursingNotesRepository extends JpaRepository<NursingNote, Long> {

    List<NursingNote> findByPatientId(Long patientId);

    List<NursingNote> findByAdmissionId(Long admissionId);

}
