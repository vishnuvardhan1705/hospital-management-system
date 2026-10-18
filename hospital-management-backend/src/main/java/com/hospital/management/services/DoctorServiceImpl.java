package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

import com.hospital.management.dto.DoctorRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Hospital;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.HospitalRepository;

@Service
public class DoctorServiceImpl implements DoctorService {
	
	private DoctorRepository doctorRepository;
	private HospitalRepository hospitalRepository;
	private DepartmentRepository departmentRepository;
	
	public DoctorServiceImpl(DoctorRepository doctorRepository, HospitalRepository hospitalRepository,
			DepartmentRepository departmentRepository) {
		super();
		this.doctorRepository = doctorRepository;
		this.hospitalRepository = hospitalRepository;
		this.departmentRepository = departmentRepository;
	}
	

	@Override
	public Doctor saveDoctor(DoctorRequest doctor) {
		Hospital hospital = hospitalRepository.findById(doctor.getHospitalId()).orElseThrow(()->
									new RuntimeException("Hospital not found with id : "+doctor.getHospitalId()));
		
		Department department = departmentRepository.findById(doctor.getDepartmentId()).orElseThrow(()->
									new RuntimeException("Hospital not found with id : "+doctor.getDepartmentId()));
		
		Doctor doct = new Doctor();
		doct.setHospital(hospital);
        doct.setDepartment(department);

        doct.setName(doctor.getFullName());
        doct.setGender(doctor.getGender());
        doct.setDateofBirth(doctor.getDateOfBirth());
        doct.setPhone(doctor.getPhone());
        doct.setEmail(doctor.getEmail());
        doct.setAddress(doctor.getAddress());
        doct.setSpecialization(doctor.getSpecialization());
        doct.setQualification(doctor.getQualification());
        doct.setRegistrationNumber(doctor.getRegistrationNumber());
        doct.setExperienceYears(doctor.getExperienceYears());
        doct.setConsoultationFee(doctor.getConsultationFee());
        doct.setStatus(doctor.getStatus());
        doct.setCreatedAt(LocalDateTime.now());
		
		return doctorRepository.save(doct);
	}

	@Override
	public List<Doctor> findAllDocotrs() {
		return doctorRepository.findAll();
	}

	@Override
	public Doctor findById(Long id) {
		return doctorRepository.findById(id).orElseThrow(()->
				new RuntimeException("Doctor not found with id : "+id));
	}

	@Override
	public List<Doctor> findByHospId(Long hospid) {
		return doctorRepository.findByHospitalId(hospid);
	}

	@Override
	public List<Doctor> findByDeprtId(Long depid) {
		return doctorRepository.findByDepartmentId(depid);
	}

	@Override
	public Doctor updateDocotr(Long id, DoctorRequest doctor) {
		Doctor doct = doctorRepository.findById(id).orElseThrow(()->
								new RuntimeException("Doctor not found with id : "+id));
		
		if(doctor.getHospitalId() != null) {
			Hospital hospital = hospitalRepository.findById(doctor.getHospitalId()).orElseThrow(()->
									new RuntimeException("Hospital not found with id : "+doctor.getHospitalId()));
			
			doct.setHospital(hospital);
		}
		
		if(doctor.getDepartmentId() != null) {
			Department department = departmentRepository.findById(doctor.getDepartmentId()).orElseThrow(()->
												new RuntimeException("Hospital not found with id : "+doctor.getDepartmentId()));
		
			doct.setDepartment(department);
		}
		
		doct.setName(doctor.getFullName());
        doct.setGender(doctor.getGender());
        doct.setDateofBirth(doctor.getDateOfBirth());
        doct.setPhone(doctor.getPhone());
        doct.setEmail(doctor.getEmail());
        doct.setAddress(doctor.getAddress());
        doct.setSpecialization(doctor.getSpecialization());
        doct.setQualification(doctor.getQualification());
        doct.setRegistrationNumber(doctor.getRegistrationNumber());
        doct.setExperienceYears(doctor.getExperienceYears());
        doct.setConsoultationFee(doctor.getConsultationFee());
        doct.setStatus(doctor.getStatus());
        doct.setCreatedAt(LocalDateTime.now());
		
		return doctorRepository.save(doct);
	}


	@Override
	public void deleteDoctor(Doctor doctor) {
	    if (doctor == null || doctor.getId() == null) {
	        throw new IllegalArgumentException(
	                "A valid doctor is required");
	    }

	    doctorRepository.delete(doctor);
		
	}

}
