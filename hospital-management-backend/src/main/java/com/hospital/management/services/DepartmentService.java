package com.hospital.management.services;

import java.util.List;
import com.hospital.management.dto.DepartmentRequest;
import com.hospital.management.entity.Department;

public interface DepartmentService {
	
	public Department saveDepartment(DepartmentRequest department);
	public void deleteDepartment(Department department);
	public Department findById(Long id);
	public List<Department> findDepByHospID(Long hospid);
	public List<Department> findAllDepartments();
	public Department updateDepartment(Long id,DepartmentRequest department);
}
