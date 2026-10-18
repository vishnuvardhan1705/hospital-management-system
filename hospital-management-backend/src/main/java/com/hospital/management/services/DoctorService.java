package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DoctorRequest;
import com.hospital.management.entity.Doctor;

public interface DoctorService {
	
	public Doctor saveDoctor(DoctorRequest doctor);
	public List<Doctor> findAllDocotrs();
	public Doctor findById(Long id);
	public List<Doctor> findByHospId(Long hospid);
	public List<Doctor> findByDeprtId(Long depid);
	public Doctor updateDocotr(Long id, DoctorRequest doctor);
	public void deleteDoctor(Doctor doctor);

}
