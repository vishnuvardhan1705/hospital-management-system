package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.BedRequest;
import com.hospital.management.entity.Bed;
import com.hospital.management.entity.Room;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.RoomRepository;

@Service
public class BedServiceImpl implements BedService {
	
	private BedRepository bedRepository;
	private RoomRepository roomRepository;

	public BedServiceImpl(BedRepository bedRepository, RoomRepository roomRepository) {
		super();
		this.bedRepository = bedRepository;
		this.roomRepository = roomRepository;
	}

	@Override
	public Bed createBed(BedRequest request) {
		Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() ->
                        new RuntimeException("Room not found"));

        Bed bed = new Bed();

        bed.setRoom(room);
        bed.setBedNumber(request.getBedNumber());
        bed.setBedType(request.getBedType());
        bed.setStatus(request.getStatus());

        return bedRepository.save(bed);
	}

	@Override
	public List<Bed> getAllBeds() {
		return bedRepository.findAll();
	}

	@Override
	public List<Bed> getBedsByRoom(Long roomId) {

		return bedRepository.findByRoomId(roomId);
	}

	@Override
	public Bed getBed(Long bedId) {

		return bedRepository.findById(bedId).orElseThrow(() ->
                			new RuntimeException("Bed not found"));
	}

	@Override
	public Bed updateBed(Long bedId, BedRequest request) {
		Bed bed = bedRepository.findById(bedId).orElseThrow(() ->
                        new RuntimeException("Bed not found"));

        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() ->
                        new RuntimeException("Room not found"));

        bed.setRoom(room);
        bed.setBedNumber(request.getBedNumber());
        bed.setBedType(request.getBedType());
        bed.setStatus(request.getStatus());

        return bedRepository.save(bed);
	}

}
