package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.RoomRequest;
import com.hospital.management.entity.Room;
import com.hospital.management.services.RoomService;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

	private RoomService roomService;

	public RoomController(RoomService roomService) {
		super();
		this.roomService = roomService;
	}
	
	@PostMapping
    public Room createRoom(@RequestBody RoomRequest request) {
        return roomService.createRoom(request);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/ward/{wardId}")
    public List<Room> getRoomsByWard(
            @PathVariable Long wardId) {

        return roomService.getRoomsByWard(wardId);
    }

    @GetMapping("/{roomId}")
    public Room getRoom(
            @PathVariable Long roomId) {

        return roomService.getRoom(roomId);
    }

    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable Long roomId,@RequestBody RoomRequest request) {

        return roomService.updateRoom(roomId, request);
    }
}
