package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.WardRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Ward;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.WardRepository;

@Service
public class WardServiceImpl implements WardService {
	
	private WardRepository wardRepository;
	private DepartmentRepository departmentRepository;

	public WardServiceImpl(WardRepository wardRepository, DepartmentRepository departmentRepository) {
		super();
		this.wardRepository = wardRepository;
		this.departmentRepository = departmentRepository;
	}

	@Override
	public Ward createWard(WardRequest request) {
		Department department =departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() ->new RuntimeException("Department not found"));

        Ward ward = new Ward();

        ward.setDepartment(department);
        ward.setWardName(request.getWardName());
        ward.setWardType(request.getWardType());
        ward.setFloor(request.getFloor());
        ward.setCapacity(request.getCapacity());
        ward.setStatus(request.getStatus());

        return wardRepository.save(ward);
	}

	@Override
	public List<Ward> getAllWards() {

		return wardRepository.findAll();
	}

	@Override
	public List<Ward> getWardsByDepartment(Long departmentId) {

		return wardRepository.findByDepartmentId(departmentId);
	}

	@Override
	public Ward getWard(Long wardId) {

		return wardRepository.findById(wardId).orElseThrow(()->
					new RuntimeException("Ward not found"));
	}

	@Override
	public Ward updateWard(Long wardId, WardRequest request) {
		Ward ward = wardRepository.findById(wardId).orElseThrow(() ->
                        new RuntimeException("Ward not found"));

        Department department =departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() ->new RuntimeException("Department not found"));

        ward.setDepartment(department);
        ward.setWardName(request.getWardName());
        ward.setWardType(request.getWardType());
        ward.setFloor(request.getFloor());
        ward.setCapacity(request.getCapacity());
        ward.setStatus(request.getStatus());

        return wardRepository.save(ward);
	}

}
