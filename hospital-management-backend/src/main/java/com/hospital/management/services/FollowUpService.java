package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.FollowUpRequest;
import com.hospital.management.entity.FollowUp;

public interface FollowUpService {

	public FollowUp createFollowUp(FollowUpRequest request);
	public FollowUp updateFollowUp(Long followUpId, FollowUpRequest request);
	public FollowUp getFollowUp(Long followUpId);
	public List<FollowUp> getFollowUpByPatient(Long patientId);
	public List<FollowUp> getUpcomingFollowUp();
	public FollowUp completeFollowUp(Long followUpId);
	public FollowUp cancelFollowUp(Long followUpId);
}
