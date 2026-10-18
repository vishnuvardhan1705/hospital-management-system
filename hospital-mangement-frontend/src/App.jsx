
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Patients from "./pages/Patients";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import Appointments from "./pages/Appointments";
import AppointmentForm from "./pages/AppointmentForm";
import AppointmentDetails from "./pages/AppointmentDetails";
import Doctors from "./pages/Doctors";
import DoctorForm from "./pages/DoctorForm";
import DoctorDetails from "./pages/DoctorDetails";
import Visits from "./pages/Visits";
import VisitDetails from "./pages/VisitDetails";
import Queue from "./pages/Queue";
import Consultations from "./pages/Consultations";
import ConsultationDetails from "./pages/ConsultationDetails";
import ClinicalObservations from "./pages/ClinicalObservations";
import Prescriptions from "./pages/Prescriptions";
import PrescriptionCreate from "./pages/PrescriptionCreate";
import PrescriptionDetails from "./pages/PrescriptionDetails";
import Medicines from "./pages/Medicines";
import MedicineForm from "./pages/MedicineForm";
import MedicineBatches from "./pages/MedicineBatches";
import PharmacyDispensing from "./pages/PharmacyDispensing";
import LaboratoryManagement from "./pages/LaboratoryManagement";
import RadiologyManagement from "./pages/RadiologyManagement";
import InpatientManagement from "./pages/InpatientManagement";
import NursingManagement from "./pages/NursingManagement";
import EmergencyManagement from "./pages/EmergencyManagement";
import SurgeryManagement from "./pages/SurgeryManagement";
import BillingManagement from "./pages/BillingManagement";
import InsuranceManagement from "./pages/InsuranceManagement";
import DischargeManagement from "./pages/DischargeManagement";
import FollowUpManagement from "./pages/FollowUpManagement";
import NotificationManagement from "./pages/NotificationManagement";
import ReportManagement from "./pages/ReportManagement";
import AuditLogManagement from "./pages/AuditLogManagement";
import UserManagement from "./pages/UserManagement";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="patients" element={<Patients />} />
          <Route path="patients/new" element={<PatientForm />} />
          <Route path="patients/:patientId" element={<PatientDetails />} />

          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/new" element={<AppointmentForm />} />
          <Route
              path="appointments/:appointmentId"
              element={<AppointmentDetails />}
          />

          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/:doctorId/edit" element={<DoctorForm />} />
          <Route path="doctors/:doctorId" element={<DoctorDetails />} />

          
          <Route path="visits" element={<Visits />} />
          <Route path="visits/:visitId" element={<VisitDetails />} />
          <Route path="queue" element={<Queue />} />

          <Route path="consultations" element={<Consultations />} />
          <Route path="consultations/:consultationId"
            element={<ConsultationDetails />}/>

          <Route
            path="clinical-observations"
            element={<ClinicalObservations />}
          />

          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="prescriptions/new" element={<PrescriptionCreate />} />
          <Route
            path="prescriptions/:prescriptionId"
            element={<PrescriptionDetails />}
          />
          <Route path="medicines" element={<Medicines />} />
          <Route path="medicines/new" element={<MedicineForm />} />
          <Route path="medicines/:medicineId/edit" element={<MedicineForm />} />
          
          <Route path="medicine-batches" element={<MedicineBatches />} />
          
          <Route
            path="pharmacy-dispensing"
            element={<PharmacyDispensing />}
          />

        <Route
          path="laboratory"
          element={<LaboratoryManagement />}
        />

        <Route
          path="radiology"
          element={<RadiologyManagement />}
        />
        
        <Route
          path="inpatient"
          element={<InpatientManagement />}
        />

        <Route path="nursing" element={<NursingManagement />} />

        <Route
          path="emergency"
          element={<EmergencyManagement />}
        />

        <Route
          path="surgery"
          element={<SurgeryManagement />}
        />

        <Route
          path="billing"
          element={<BillingManagement />}
        />

        <Route
          path="discharge"
          element={<DischargeManagement />}
        />
        <Route
          path="insurance"
          element={<InsuranceManagement />}
        />

        <Route
          path="follow-ups"
          element={<FollowUpManagement />}
        />

        <Route
          path="notifications"
          element={<NotificationManagement />}
        />

        <Route path="reports" element={<ReportManagement />} />
        </Route>

        <Route path="audit-logs" element={<AuditLogManagement />} />

        <Route path="users" element={<UserManagement />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
