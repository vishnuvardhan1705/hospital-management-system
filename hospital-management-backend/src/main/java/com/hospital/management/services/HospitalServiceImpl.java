package com.hospital.management.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.management.entity.Hospital;
import com.hospital.management.repository.HospitalRepository;

@Service
public class HospitalServiceImpl implements HospitalService {
	
	@Autowired
	private HospitalRepository hospitalRepository;
	
	public HospitalServiceImpl(HospitalRepository hospitalRepository) {
		super();
		this.hospitalRepository = hospitalRepository;
	}

	@Override
	public Hospital createHospital(Hospital hospital) {
		
		return hospitalRepository.save(hospital);
	}

	@Override
	public Hospital updateHospital(Hospital hospital) {
		return hospitalRepository.save(hospital);
	}

	@Override
	public Hospital getHospital(long id) {
		return hospitalRepository.findById(id).orElseThrow(()-> 
							new RuntimeException("Hospital not found with id : "+id));
	}

	@Override
	public List<Hospital> findAll() {
		return hospitalRepository.findAll();
	}

	@Override
	public void deleteHospital(Hospital hospital) {
		hospitalRepository.delete(hospital);
	}

}
