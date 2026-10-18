package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.RoomRequest;
import com.hospital.management.entity.Room;
import com.hospital.management.entity.Ward;
import com.hospital.management.repository.RoomRepository;
import com.hospital.management.repository.WardRepository;

@Service
public class RoomServiceImpl implements RoomService {
	
	private RoomRepository roomRepository;
	private WardRepository wardRepository;

	public RoomServiceImpl(RoomRepository roomRepository, WardRepository wardRepository) {
		super();
		this.roomRepository = roomRepository;
		this.wardRepository = wardRepository;
	}

	@Override
	public Room createRoom(RoomRequest request) {
		Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() ->new RuntimeException("Ward not found"));

        Room room = new Room();

        room.setWard(ward);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloor(request.getFloor());
        room.setDailyCharge(request.getDailyCharge());
        room.setStatus(request.getStatus());

        return roomRepository.save(room);
	}

	@Override
	public List<Room> getAllRooms() {

		return roomRepository.findAll();
	}

	@Override
	public List<Room> getRoomsByWard(Long wardId) {

		return roomRepository.findByWardId(wardId);
	}

	@Override
	public Room getRoom(Long roomId) {

		return roomRepository.findById(roomId).orElseThrow(()->
							new RuntimeException("Room not found"));
	}

	@Override
	public Room updateRoom(Long roomId, RoomRequest request) {
		Room room = roomRepository.findById(roomId).orElseThrow(() ->
                        new RuntimeException("Room not found"));

        Ward ward = wardRepository.findById(request.getWardId()).orElseThrow(() ->
                        new RuntimeException("Ward not found"));

        room.setWard(ward);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setFloor(request.getFloor());
        room.setDailyCharge(request.getDailyCharge());
        room.setStatus(request.getStatus());

        return roomRepository.save(room);
	}

}
