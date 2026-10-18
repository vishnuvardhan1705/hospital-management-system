package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Bed;

public interface BedRepository extends JpaRepository<Bed, Long> {

	List<Bed> findByRoomId(Long roomId);
}
