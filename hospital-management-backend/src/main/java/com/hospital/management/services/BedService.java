package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.BedRequest;
import com.hospital.management.entity.Bed;

public interface BedService {

    public Bed createBed(BedRequest request);

    public List<Bed> getAllBeds();

    public List<Bed> getBedsByRoom(Long roomId);

    public Bed getBed(Long bedId);

    public Bed updateBed(Long bedId, BedRequest request);
}
