package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.BedRequest;
import com.hospital.management.entity.Bed;
import com.hospital.management.services.BedService;

@RestController
@RequestMapping("/api/beds")
public class BedController {

	private BedService bedService;

	public BedController(BedService bedService) {
		super();
		this.bedService = bedService;
	}
	
	@PostMapping
    public Bed createBed(@RequestBody BedRequest request) {
        return bedService.createBed(request);
    }

    @GetMapping
    public List<Bed> getAllBeds() {
        return bedService.getAllBeds();
    }

    @GetMapping("/room/{roomId}")
    public List<Bed> getBedsByRoom(
            @PathVariable Long roomId) {

        return bedService.getBedsByRoom(roomId);
    }

    @GetMapping("/{bedId}")
    public Bed getBed(
            @PathVariable Long bedId) {

        return bedService.getBed(bedId);
    }

    @PutMapping("/{bedId}")
    public Bed updateBed(@PathVariable Long bedId,@RequestBody BedRequest request) {

        return bedService.updateBed(bedId, request);
    }
}
