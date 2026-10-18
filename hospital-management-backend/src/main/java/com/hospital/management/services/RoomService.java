package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.RoomRequest;
import com.hospital.management.entity.Room;

public interface RoomService {

    public Room createRoom(RoomRequest request);

    public List<Room> getAllRooms();

    public List<Room> getRoomsByWard(Long wardId);

    public Room getRoom(Long roomId);

    public Room updateRoom(Long roomId, RoomRequest request);
	
}
