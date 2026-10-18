package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DepartmentRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.services.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
	
	@Autowired
	private DepartmentService departmentService;
	
	
	@GetMapping
	public List<Department> allDepartments(){
		List<Department> departments= departmentService.findAllDepartments();
		
		return departments;
	}
	
	@GetMapping("/{id}")
	public Department getdep(@PathVariable("id") Long id) {
		Department dep = departmentService.findById(id);
		return dep;
	}
	
	@GetMapping("/hospital/{id}")
	public List<Department> finddepbyHospid(@PathVariable("id") Long id){
		List<Department> dep = departmentService.findDepByHospID(id);
		
		return dep;
	}
	
	@PostMapping
	public Department createDep(@RequestBody DepartmentRequest department) {
		Department savedepartment = departmentService.saveDepartment(department);
		
		return savedepartment;
	}
	
	@PutMapping("/{id}")
	public Department updateDep(@PathVariable("id") Long id	,@RequestBody DepartmentRequest department) {
		Department updateddep = departmentService.updateDepartment(id,department);
		
		return updateddep;
	}
	
}
