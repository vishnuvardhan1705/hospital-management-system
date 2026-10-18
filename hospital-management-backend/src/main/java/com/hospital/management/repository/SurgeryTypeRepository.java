package com.hospital.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.SurgeryType;


public interface SurgeryTypeRepository extends JpaRepository<SurgeryType, Long> {

}
