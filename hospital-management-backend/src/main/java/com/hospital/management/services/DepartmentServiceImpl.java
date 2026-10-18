package com.hospital.management.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.hospital.management.dto.DepartmentRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Hospital;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.HospitalRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {
	
	private DepartmentRepository departmentRepository;
	
	private HospitalRepository hospitalRepository;

	public DepartmentServiceImpl(DepartmentRepository departmentRepository, HospitalRepository hospitalRepository) {
		super();
		this.departmentRepository = departmentRepository;
		this.hospitalRepository = hospitalRepository;
	}

	@Override
	public Department saveDepartment(DepartmentRequest department) {
		Hospital hospital = hospitalRepository.findById(department.getHospitalId()).orElseThrow(()->
															new RuntimeException("Hospital not found with id : "+department.getHospitalId()));
		Department dep = new Department();
		dep.setDepartmentName(department.getDepartmentName());
		dep.setDescription(department.getDescription());
		dep.setHospital(hospital);
		dep.setLocation(department.getLocation());
		dep.setStatus(department.getStatus());
		
		return departmentRepository.save(dep);
	}

	@Override
	public void deleteDepartment(Department department) {
		departmentRepository.delete(department);
	}

	@Override
	public List<Department> findDepByHospID(Long hospid) {
		return departmentRepository.findByHospitalId(hospid);
	}

	@Override
	public List<Department> findAllDepartments() {
		return departmentRepository.findAll();
	}

	@Override
	public Department findById(Long id) {
		return departmentRepository.findById(id).orElseThrow(()->
								new RuntimeException("Department not found with id : "+id));
	}

	@Override
	public Department updateDepartment(Long id, DepartmentRequest department) {
		Department dep = departmentRepository.findById(id).orElseThrow(()->
									new RuntimeException("Department not found with id : "+id));

		if(department.getHospitalId() != null) {
		Hospital hospital = hospitalRepository.findById(department.getHospitalId()).orElseThrow(()->
				new RuntimeException("Hospital not found with id : "+department.getHospitalId()));
		
		dep.setHospital(hospital);
		}
		
		dep.setDepartmentName(department.getDepartmentName());
		dep.setDescription(department.getDescription());
		dep.setLocation(department.getLocation());
		dep.setStatus(department.getStatus());
		
		return departmentRepository.save(dep);
	}

}
