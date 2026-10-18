package com.hospital.management.services;

import java.util.List;

import com.hospital.management.entity.Hospital;

public interface HospitalService {
	
	public Hospital createHospital(Hospital hospital);
	public Hospital updateHospital(Hospital hospital);
	public Hospital getHospital(long id);
	public List<Hospital> findAll();
	public void deleteHospital(Hospital hospital);

}
