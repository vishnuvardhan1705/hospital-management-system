package com.hospital.management.services;

import java.util.List;

import com.hospital.management.entity.PatientQueue;

public interface PatientQueueService {
	
	public PatientQueue generateToken(Long visitId);
	public List<PatientQueue> getCurrentQueue();
	public List<PatientQueue> getDoctorQueue(Long doctorId);
	public PatientQueue callPatient(Long queueId);
	public PatientQueue completePatient(Long queueId);

}
