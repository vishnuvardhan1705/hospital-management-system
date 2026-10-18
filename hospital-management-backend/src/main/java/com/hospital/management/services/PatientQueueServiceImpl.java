package com.hospital.management.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.PatientQueue;
import com.hospital.management.entity.PatientVisit;
import com.hospital.management.repository.PatientQueueRepository;
import com.hospital.management.repository.PatientVisitRepository;

@Service
public class PatientQueueServiceImpl implements PatientQueueService {

	private PatientQueueRepository patientQueueRepository;
	private PatientVisitRepository patientVisitRepository;
	
	
	public PatientQueueServiceImpl(PatientQueueRepository patientQueueRepository,
			PatientVisitRepository patientVisitRepository) {
		this.patientQueueRepository = patientQueueRepository;
		this.patientVisitRepository = patientVisitRepository;
	}

	@Override
	public PatientQueue generateToken(Long visitId) {
		PatientVisit visit = patientVisitRepository.findById(visitId).orElseThrow(()->
								new RuntimeException("visit not found"));
		
		if(!"CHECKED_IN".equals(visit.getStatus())) {
			throw new RuntimeException("Patient must be check in before generating token");
		}
		
		LocalDate today = LocalDate.now();
		
		List<PatientQueue> existingQueue = patientQueueRepository.findByDoctorIdAndQueueDateOrderByQueuePositionAsc(visit.getDoctor().getId(), today);
		
		for(PatientQueue queue : existingQueue) {
			if(queue.getPatientVisit().getId().equals(visitId)) {
				throw new RuntimeException("TOken already generated for this visit");
			}
		}
		
		int nextPosition = existingQueue.size() + 1;

        PatientQueue queue = new PatientQueue();

        queue.setPatientVisit(visit);
        queue.setPatient(visit.getPatient());
        queue.setDoctor(visit.getDoctor());

        queue.setTokenNumber(nextPosition);
        queue.setQueuePosition(nextPosition);
        queue.setQueueDate(today);

        queue.setStatus("WAITING");

        return patientQueueRepository.save(queue);
	}

	@Override
	public List<PatientQueue> getCurrentQueue() {
		return patientQueueRepository.findByQueueDateAndStatusOrderByQueuePositionAsc(LocalDate.now(),"WAITING");
	}

	@Override
	public List<PatientQueue> getDoctorQueue(Long doctorId) {
		return patientQueueRepository.findByDoctorIdAndQueueDateOrderByQueuePositionAsc(doctorId, LocalDate.now());
	}

	@Override
	@Transactional
	public PatientQueue callPatient(Long queueId) {
		PatientQueue queue = getQueue(queueId);
		
		if (!"WAITING".equals(queue.getStatus())) {

            throw new RuntimeException("Only waiting patients can be called");
        }

        queue.setStatus("CALLED");
        queue.setCalledAt(LocalDateTime.now());

        queue.getPatientVisit().setStatus("IN_CONSULTATION");
        patientVisitRepository.save(queue.getPatientVisit());

        return patientQueueRepository.save(queue); 
	}

	@Override
	@Transactional
	public PatientQueue completePatient(Long queueId) {
		PatientQueue queue = getQueue(queueId);

        if (!"CALLED".equals(queue.getStatus())) {

            throw new RuntimeException(
                    "Patient must be called before completing"
            );
        }

        queue.setStatus("COMPLETED");
        queue.setCompletedAt(LocalDateTime.now());

        queue.getPatientVisit().setStatus("COMPLETED");
        patientVisitRepository.save(queue.getPatientVisit());

        return patientQueueRepository.save(queue);
	}
	
	private PatientQueue getQueue(Long queueId) {
        return patientQueueRepository.findById(queueId).orElseThrow(() ->
                        new RuntimeException("Queue not found with id: " + queueId));
    }

}
