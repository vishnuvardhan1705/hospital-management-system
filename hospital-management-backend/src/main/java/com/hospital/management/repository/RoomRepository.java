package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findByWardId(Long wardId);
}
