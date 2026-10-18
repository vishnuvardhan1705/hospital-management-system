package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.WardRequest;
import com.hospital.management.entity.Ward;

public interface WardService {

	 public Ward createWard(WardRequest request);

	 public List<Ward> getAllWards();

	 public List<Ward> getWardsByDepartment(Long departmentId);

	 public Ward getWard(Long wardId);

	 public Ward updateWard(Long wardId, WardRequest request);
}
