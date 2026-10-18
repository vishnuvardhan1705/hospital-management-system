package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hospital.management.dto.WardRequest;
import com.hospital.management.entity.Ward;
import com.hospital.management.services.WardService;

@RestController
@RequestMapping("/api/wards")
public class WardController {

	private WardService wardService;

	public WardController(WardService wardService) {
		super();
		this.wardService = wardService;
	}
	
	@PostMapping
	public Ward createward(@RequestBody WardRequest request) {
		
		return wardService.createWard(request);
	}
	
	@GetMapping
	public List<Ward> getallWards(){
		
		return wardService.getAllWards();
	}
	
	@GetMapping("/{wardId}")
	public Ward getward(@PathVariable Long wardId) {
		
		return wardService.getWard(wardId);
	}
	
	@GetMapping("/department/{departmentId}")
	public List<Ward> getdepartmentWard(@PathVariable Long departmentId){
		
		return wardService.getWardsByDepartment(departmentId);
	}
	
	@PutMapping("/{wardId}")
	public Ward updateward(@PathVariable Long wardId,@RequestBody WardRequest request) {
		
		return wardService.updateWard(wardId, request);
	}
}

