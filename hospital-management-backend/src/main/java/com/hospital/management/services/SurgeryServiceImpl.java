package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.CompleteSurgeryRequest;
import com.hospital.management.dto.OperationTheaterRequest;
import com.hospital.management.dto.ScheduleSurgeryRequest;
import com.hospital.management.dto.SurgeryRequestDto;
import com.hospital.management.dto.SurgeryTypeRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.OperationTheaters;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Surgery;
import com.hospital.management.entity.SurgeryRequest;
import com.hospital.management.entity.SurgeryType;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.OperationTheatreRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.SurgeryRepository;
import com.hospital.management.repository.SurgeryRequestRepository;
import com.hospital.management.repository.SurgeryTypeRepository;

@Service
public class SurgeryServiceImpl implements SurgeryService {
	
	private SurgeryTypeRepository surgeryTypeRepository;
	private OperationTheatreRepository operationTheatreRepository;
	private SurgeryRepository surgeryRepository;
	private SurgeryRequestRepository surgeryRequestRepository;
	private PatientRepository patientRepository;
	private DoctorRepository doctorRepository;
	private AdmissionRepository admissionRepository;

	public SurgeryServiceImpl(SurgeryTypeRepository surgeryTypeRepository,
			OperationTheatreRepository operationTheatreRepository, SurgeryRepository surgeryRepository,
			SurgeryRequestRepository surgeryRequestRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository,AdmissionRepository admissionRepository) {
		super();
		this.surgeryTypeRepository = surgeryTypeRepository;
		this.operationTheatreRepository = operationTheatreRepository;
		this.surgeryRepository = surgeryRepository;
		this.surgeryRequestRepository = surgeryRequestRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.admissionRepository = admissionRepository;
	}

	@Override
	public SurgeryType createSurgeryType(SurgeryTypeRequest request) {
        SurgeryType type = new SurgeryType();

        type.setSurgeryName(request.getSurgeryName());
        type.setSurgeryCode(request.getSurgeryCode());
        type.setDescription(request.getDescription());
        type.setStandardCharge(request.getStandardCharge());
        type.setEstimatedDuration(request.getEstimatedDuration());
        type.setStatus(request.getStatus());

        return surgeryTypeRepository.save(type);
	}

	@Override
	public List<SurgeryType> getAllSurgeryType() {
		
		return surgeryTypeRepository.findAll();
	}

	@Override
	public OperationTheaters createOperationTheatre(OperationTheaterRequest request) {
        OperationTheaters theatre = new OperationTheaters();

        theatre.setOtName(request.getOtName());
        theatre.setLocation(request.getLocation());
        theatre.setCapacity(request.getCapacity());
        theatre.setStatus(request.getStatus());

        return operationTheatreRepository.save(theatre);
	}

	@Override
	public List<OperationTheaters> getAllOperationTheaters() {
		
		return operationTheatreRepository.findAll();
	}

	@Override
	public SurgeryRequest createSurgeryRequest(SurgeryRequestDto request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        SurgeryType surgeryType = surgeryTypeRepository.findById(request.getSurgeryTypeId()).orElseThrow(() ->
                        new RuntimeException("Surgery type not found"));

        SurgeryRequest surgeryRequest = new SurgeryRequest();

        surgeryRequest.setPatient(patient);
        surgeryRequest.setDoctor(doctor);
        surgeryRequest.setSurgeryType(surgeryType);
        surgeryRequest.setReason(request.getReason());
        surgeryRequest.setPriority(request.getPriority());
        surgeryRequest.setRequestedDate(LocalDateTime.now());
        surgeryRequest.setStatus("REQUESTED");

        if (request.getAdmissionId() != null) {
            Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
                            new RuntimeException("Admission not found"));

            surgeryRequest.setAdmission(admission);
        }

        return surgeryRequestRepository.save(surgeryRequest);
	}

	@Override
	public SurgeryRequest getSurgeryRequest(Long surgeryRequestId) {
		
		return surgeryRequestRepository.findById(surgeryRequestId).orElseThrow(()->
						new RuntimeException("Surgery Request not found"));
	}

	@Override
	public SurgeryRequest approveSurgery(Long requestId) {
		SurgeryRequest request= surgeryRequestRepository.findById(requestId).orElseThrow(()->
										new RuntimeException("Surgery request not found"));
		
		if(!"REQUESTED".equals(request.getStatus())) {
			
			throw new RuntimeException("Only a requested surgery can approved");
		}
		
		request.setStatus("APPROVED");
		
		return surgeryRequestRepository.save(request);
	}

	@Override
	@Transactional
	public Surgery scheduleSurgery(Long requestId, ScheduleSurgeryRequest request) {
		
        SurgeryRequest surgeryRequest = surgeryRequestRepository.findById(requestId).orElseThrow(() ->
                        						new RuntimeException("Surgery request not found"));

        if (!"APPROVED".equals(surgeryRequest.getStatus())) {
            throw new RuntimeException("Approve the surgery request before scheduling");
        }

        if (request.getScheduledStart() == null || request.getScheduledEnd() == null || !request.getScheduledEnd().isAfter(request.getScheduledStart())) {
            throw new RuntimeException("Scheduled end must be after scheduled start");
        }

        Doctor surgeon = doctorRepository.findById(request.getSurgeonId()).orElseThrow(() ->
        						new RuntimeException("Surgeon not found"));

        OperationTheaters theatre = operationTheatreRepository.findById(request.getOtId()).orElseThrow(() ->
                        new RuntimeException("Operation theatre not found"));

        Surgery surgery = new Surgery();

        surgery.setSurgeryRequest(surgeryRequest);
        surgery.setPatient(surgeryRequest.getPatient());
        surgery.setSurgeon(surgeon);
        surgery.setOperationTheatre(theatre);
        surgery.setScheduledStart(request.getScheduledStart());
        surgery.setScheduledEnd(request.getScheduledEnd());
        surgery.setAnesthesiaType(request.getAnesthesiaType());
        surgery.setStatus("SCHEDULED");

        Surgery savedSurgery = surgeryRepository.save(surgery);

        surgeryRequest.setStatus("SCHEDULED");
        surgeryRequestRepository.save(surgeryRequest);

        return savedSurgery;
	}

	@Override
	public Surgery startSurgery(Long surgeryId) {
		Surgery surgery = surgeryRepository.findById(surgeryId).orElseThrow(()->
						new RuntimeException("Surgery not found"));
		
        if (!"SCHEDULED".equals(surgery.getStatus())) {
            throw new RuntimeException("Only a SCHEDULED surgery can be started");
        }

        surgery.setActualStart(LocalDateTime.now());
        surgery.setStatus("IN_PROGRESS");

        return surgeryRepository.save(surgery);
	}

	@Override
	public Surgery completeSurgery(Long surgeryId, CompleteSurgeryRequest request) {
		
		Surgery surgery = surgeryRepository.findById(surgeryId).orElseThrow(()->
							new RuntimeException("Surgery not found"));

		if(!"IN_PROGRESS".equals(surgery.getStatus())) {
		throw new RuntimeException("Only a IN_PROGRESS surgery can be completed");
		}
		
		surgery.setActualEnd(LocalDateTime.now());
		surgery.setOutcome(request.getOutcome());
		surgery.setStatus("COMPLETED");

        Surgery savedSurgery = surgeryRepository.save(surgery);

        SurgeryRequest surgeryRequest = surgery.getSurgeryRequest();
        surgeryRequest.setStatus("COMPLETED");
        surgeryRequestRepository.save(surgeryRequest);

        return savedSurgery;
	}

	@Override
	public Surgery cancelSurgery(Long surgeryId) {
		Surgery surgery = surgeryRepository.findById(surgeryId).orElseThrow(()->
							new RuntimeException("Surgery not found"));
		
		if ("COMPLETED".equals(surgery.getStatus()) || "IN_PROGRESS".equals(surgery.getStatus())) {
            throw new RuntimeException("An IN_PROGRESS or COMPLETED surgery cannot be cancelled");
        }
		
        surgery.setStatus("CANCELLED");

        Surgery savedSurgery = surgeryRepository.save(surgery);

        SurgeryRequest surgeryRequest = surgery.getSurgeryRequest();
        surgeryRequest.setStatus("CANCELLED");
        surgeryRequestRepository.save(surgeryRequest);		 
		 
		return savedSurgery;
	}

	@Override
	public List<Surgery> getSurgeriesByPatient(Long patientId) {
		
		return surgeryRepository.findByPatientId(patientId);
	}

	@Override
	public List<Surgery> getSurgeryByStatus(String status) {

		return surgeryRepository.findByStatus(status);
	}

}
