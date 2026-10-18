import { useCallback, useEffect, useState } from "react";
import {
  Bed,
  Building2,
  ClipboardList,
  DoorOpen,
  Hospital,
  RefreshCw,
} from "lucide-react";
import inpatient from "../services/inpatientService";
import "../styles/inpatientManagement.css";

const emptyWard = {
  departmentId: "",
  wardName: "",
  wardType: "",
  floor: "",
  capacity: "",
  status: "ACTIVE",
};

const emptyRoom = {
  wardId: "",
  roomNumber: "",
  roomType: "",
  floor: "",
  dailyCharge: "",
  status: "AVAILABLE",
};

const emptyBed = {
  roomId: "",
  bedNumber: "",
  bedType: "",
  status: "AVAILABLE",
};

const emptyAdmission = {
  patientId: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  admissionReason: "",
  diagnosis: "",
  expectedDischargeDate: "",
  status: "REQUESTED",
};

const emptyAllocation = {
  admissionId: "",
  patientId: "",
  bedId: "",
};

const getError = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Something went wrong.";

// Normalize common Spring/API response wrappers, including nested data envelopes.
const asList = (value, depth = 0) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 4) return [];

  if (Array.isArray(value.content)) return value.content;
  if (Array.isArray(value.items)) return value.items;

  if (value.data !== undefined) return asList(value.data, depth + 1);
  if (value.result !== undefined) return asList(value.result, depth + 1);

  return [];
};

const personName = (person) => {
  if (!person) return "Unknown patient";

  const name = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ");

  return name || person.name || `ID ${person.id ?? "?"}`;
};

// Supports either "id" or "admissionId" without changing the backend.
const getAdmissionId = (admission) =>
  admission?.id ?? admission?.admissionId ?? admission?.admission_id ?? null;

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  step,
}) => (
  <label className="ip-field">
    <span>{label}</span>
    <input
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
    />
  </label>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) => (
  <label className="ip-field">
    <span>{label}</span>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      required={required}
    >
      <option value="">Select {label.toLowerCase()}</option>

      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const DataTable = ({
  columns,
  rows,
  emptyText = "No records found.",
}) => (
  <div className="ip-table-wrap">
    <table className="ip-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.label}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="ip-empty">
              {emptyText}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => (
            <tr key={row.id ?? row.allocationId ?? index}>
              {columns.map((column) => (
                <td key={column.label}>
                  {column.render
                    ? column.render(row)
                    : row[column.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default function InpatientManagement() {
  const [activeTab, setActiveTab] = useState("admissions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [wards, setWards] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [wardForm, setWardForm] = useState(emptyWard);
  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [bedForm, setBedForm] = useState(emptyBed);
  const [admissionForm, setAdmissionForm] = useState(emptyAdmission);
  const [allocationForm, setAllocationForm] = useState(emptyAllocation);

  const [editingWardId, setEditingWardId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingBedId, setEditingBedId] = useState(null);

  const [patientSearchId, setPatientSearchId] = useState("");
  const [patientAdmissionHistory, setPatientAdmissionHistory] = useState([]);

  const [allocationSearchType, setAllocationSearchType] =
    useState("patient");
  const [allocationSearchId, setAllocationSearchId] = useState("");
  const [allocationHistory, setAllocationHistory] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        wardData,
        roomData,
        bedData,
        admissionData,
        patientData,
        doctorData,
        departmentData,
      ] = await Promise.all([
        inpatient.getWards(),
        inpatient.getRooms(),
        inpatient.getBeds(),
        inpatient.getActiveAdmissions(),
        inpatient.getPatients(),
        inpatient.getDoctors(),
        inpatient.getDepartments(),
      ]);

      setWards(asList(wardData));
      setRooms(asList(roomData));
      setBeds(asList(bedData));
      setAdmissions(asList(admissionData));
      setPatients(asList(patientData));
      setDoctors(asList(doctorData));
      setDepartments(asList(departmentData));
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const perform = async (action, successMessage, afterSuccess) => {
    setError("");
    setMessage("");

    try {
      await action();

      setMessage(successMessage);

      if (afterSuccess) {
        afterSuccess();
      }

      await loadData();
    } catch (err) {
      setError(getError(err));
    }
  };

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;

    setter((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const wardOptions = wards.map((ward) => ({
    value: String(ward.id),
    label: `${ward.wardName} (ID ${ward.id})`,
  }));

  const roomOptions = rooms.map((room) => ({
    value: String(room.id),
    label: `${room.roomNumber} — ${room.roomType || "Room"} (ID ${room.id})`,
  }));

  const patientOptions = patients.map((patient) => ({
    value: String(patient.id),
    label: `${personName(patient)} (ID ${patient.id})`,
  }));

  const doctorOptions = doctors.map((doctor) => ({
    value: String(doctor.id),
    label: `${personName(doctor)} (ID ${doctor.id})`,
  }));

  const departmentOptions = departments.map((department) => ({
    value: String(department.id),
    label: `${
      department.departmentName || department.name || "Department"
    } (ID ${department.id})`,
  }));

  const availableBedOptions = beds
    .filter((bed) => bed.status?.toUpperCase() === "AVAILABLE")
    .map((bed) => ({
      value: String(bed.id),
      label: `${bed.bedNumber} — Room ${
        bed.room?.roomNumber ?? bed.room?.id ?? "—"
      } (ID ${bed.id})`,
    }));

  const tabItems = [
    { id: "admissions", label: "Admissions", icon: ClipboardList },
    { id: "wards", label: "Wards", icon: Hospital },
    { id: "rooms", label: "Rooms", icon: DoorOpen },
    { id: "beds", label: "Beds", icon: Bed },
    { id: "allocations", label: "Bed Allocation", icon: Building2 },
  ];

  const submitWard = (event) => {
    event.preventDefault();

    const data = {
      departmentId: Number(wardForm.departmentId),
      wardName: wardForm.wardName,
      wardType: wardForm.wardType,
      floor: wardForm.floor,
      capacity:
        wardForm.capacity === "" ? null : Number(wardForm.capacity),
      status: wardForm.status,
    };

    perform(
      () =>
        editingWardId
          ? inpatient.updateWard(editingWardId, data)
          : inpatient.createWard(data),
      editingWardId ? "Ward updated." : "Ward created.",
      () => {
        setWardForm(emptyWard);
        setEditingWardId(null);
      }
    );
  };

  const submitRoom = (event) => {
    event.preventDefault();

    const data = {
      wardId: Number(roomForm.wardId),
      roomNumber: roomForm.roomNumber,
      roomType: roomForm.roomType,
      floor: roomForm.floor,
      dailyCharge:
        roomForm.dailyCharge === ""
          ? null
          : Number(roomForm.dailyCharge),
      status: roomForm.status,
    };

    perform(
      () =>
        editingRoomId
          ? inpatient.updateRoom(editingRoomId, data)
          : inpatient.createRoom(data),
      editingRoomId ? "Room updated." : "Room created.",
      () => {
        setRoomForm(emptyRoom);
        setEditingRoomId(null);
      }
    );
  };

  const submitBed = (event) => {
    event.preventDefault();

    const data = {
      roomId: Number(bedForm.roomId),
      bedNumber: bedForm.bedNumber,
      bedType: bedForm.bedType,
      status: bedForm.status,
    };

    perform(
      () =>
        editingBedId
          ? inpatient.updateBed(editingBedId, data)
          : inpatient.createBed(data),
      editingBedId ? "Bed updated." : "Bed created.",
      () => {
        setBedForm(emptyBed);
        setEditingBedId(null);
      }
    );
  };

  const submitAdmission = (event) => {
    event.preventDefault();

    const data = {
      patientId: Number(admissionForm.patientId),
      admissionDate: admissionForm.admissionDate || null,
      admissionReason: admissionForm.admissionReason,
      diagnosis: admissionForm.diagnosis,
      expectedDischargeDate:
        admissionForm.expectedDischargeDate || null,
      status: admissionForm.status || "REQUESTED",
    };

    perform(
      () => inpatient.createAdmission(data),
      "Admission created.",
      () => setAdmissionForm(emptyAdmission)
    );
  };

  const submitAllocation = (event) => {
    event.preventDefault();

    const data = {
      admissionId: Number(allocationForm.admissionId),
      patientId: Number(allocationForm.patientId),
      bedId: Number(allocationForm.bedId),
    };

    perform(
      () => inpatient.allocateBed(data),
      "Bed allocated successfully.",
      () => setAllocationForm(emptyAllocation)
    );
  };

  const searchPatientAdmissions = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const result = await inpatient.getPatientAdmissions(
        Number(patientSearchId)
      );

      setPatientAdmissionHistory(asList(result));
    } catch (err) {
      setError(getError(err));
      setPatientAdmissionHistory([]);
    }
  };

  const searchAllocations = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const result =
        allocationSearchType === "patient"
          ? await inpatient.getPatientAllocationHistory(
              Number(allocationSearchId)
            )
          : await inpatient.getAdmissionAllocationHistory(
              Number(allocationSearchId)
            );

      setAllocationHistory(asList(result));
    } catch (err) {
      setError(getError(err));
      setAllocationHistory([]);
    }
  };

  const renderAdmissions = () => (
    <>
      <section className="ip-card">
        <h2>Create Admission</h2>

        <p className="ip-help">
          Enter the patient and admission details. The backend generates
          the admission number.
        </p>

        <form className="ip-form" onSubmit={submitAdmission}>
          <SelectField
            label="Patient"
            name="patientId"
            value={admissionForm.patientId}
            onChange={updateForm(setAdmissionForm)}
            options={patientOptions}
            required
          />

          <Field
            label="Admission Date"
            name="admissionDate"
            type="date"
            value={admissionForm.admissionDate}
            onChange={updateForm(setAdmissionForm)}
            required
          />

          <Field
            label="Admission Reason"
            name="admissionReason"
            value={admissionForm.admissionReason}
            onChange={updateForm(setAdmissionForm)}
            required
          />

          <Field
            label="Diagnosis"
            name="diagnosis"
            value={admissionForm.diagnosis}
            onChange={updateForm(setAdmissionForm)}
          />

          <Field
            label="Expected Discharge Date"
            name="expectedDischargeDate"
            type="date"
            value={admissionForm.expectedDischargeDate}
            onChange={updateForm(setAdmissionForm)}
          />

          <SelectField
            label="Status"
            name="status"
            value={admissionForm.status}
            onChange={updateForm(setAdmissionForm)}
            options={[
              { value: "REQUESTED", label: "REQUESTED" },
              { value: "APPROVED", label: "APPROVED" },
            ]}
            required
          />

          <button className="ip-button" type="submit">
            Create Admission
          </button>
        </form>
      </section>

      <section className="ip-card">
        <div className="ip-card-heading">
          <h2>Admissions</h2>

          <button
            type="button"
            className="ip-button ip-button-light"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Admission No.", key: "admissionNumber" },
            {
              label: "Patient",
              render: (row) => personName(row.patient),
            },
            { label: "Admission Date", key: "admissionDate" },
            { label: "Reason", key: "admissionReason" },
            { label: "Diagnosis", key: "diagnosis" },
            { label: "Status", key: "status" },
            {
              label: "Actions",
              render: (row) => (
                <div className="ip-actions">
                  {row.status !== "APPROVED" && (
                    <button
                      type="button"
                      className="ip-button ip-button-small"
                      onClick={() =>
                        perform(
                          () => inpatient.approveAdmission(row.id),
                          "Admission approved."
                        )
                      }
                    >
                      Approve
                    </button>
                  )}

                  <button
                    type="button"
                    className="ip-button ip-button-small ip-button-light"
                    onClick={() => {
                      setAllocationForm((previous) => ({
                        ...previous,
                        admissionId: String(row.id),
                        patientId: String(row.patient?.id ?? ""),
                      }));

                      setActiveTab("allocations");
                    }}
                  >
                    Allocate Bed
                  </button>

                  <button
                    type="button"
                    className="ip-button ip-button-small ip-button-light"
                    onClick={() => {
                      setAllocationSearchType("admission");
                      setAllocationSearchId(String(row.id));
                      setActiveTab("allocations");
                    }}
                  >
                    Allocation History
                  </button>
                </div>
              ),
            },
          ]}
          rows={admissions}
        />
      </section>

      <section className="ip-card">
        <h2>Assign Doctor or Ward</h2>

        <p className="ip-help">
          Select an admission to assign its doctor or ward.
        </p>

        <AssignmentForm
          admissions={admissions}
          doctors={doctors}
          wards={wards}
          onAssignDoctor={(admissionId, doctorId) =>
            perform(
              () => inpatient.assignDoctor(admissionId, doctorId),
              "Doctor assigned."
            )
          }
          onAssignWard={(admissionId, wardId) =>
            perform(
              () => inpatient.assignWard(admissionId, wardId),
              "Ward assigned."
            )
          }
        />
      </section>

      <section className="ip-card">
        <h2>Patient Admission History</h2>

        <form
          className="ip-search"
          onSubmit={searchPatientAdmissions}
        >
          <Field
            label="Patient ID"
            name="patientSearchId"
            type="number"
            min="1"
            value={patientSearchId}
            onChange={(event) =>
              setPatientSearchId(event.target.value)
            }
            required
          />

          <button className="ip-button" type="submit">
            Search History
          </button>
        </form>

        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Admission No.", key: "admissionNumber" },
            { label: "Date", key: "admissionDate" },
            { label: "Reason", key: "admissionReason" },
            { label: "Diagnosis", key: "diagnosis" },
            { label: "Status", key: "status" },
          ]}
          rows={patientAdmissionHistory}
        />
      </section>
    </>
  );

  const renderWards = () => (
    <>
      <section className="ip-card">
        <h2>{editingWardId ? "Update Ward" : "Create Ward"}</h2>

        <form className="ip-form" onSubmit={submitWard}>
          <SelectField
            label="Department"
            name="departmentId"
            value={wardForm.departmentId}
            onChange={updateForm(setWardForm)}
            options={departmentOptions}
            required
          />

          <Field
            label="Ward Name"
            name="wardName"
            value={wardForm.wardName}
            onChange={updateForm(setWardForm)}
            required
          />

          <Field
            label="Ward Type"
            name="wardType"
            value={wardForm.wardType}
            onChange={updateForm(setWardForm)}
          />

          <Field
            label="Floor"
            name="floor"
            value={wardForm.floor}
            onChange={updateForm(setWardForm)}
          />

          <Field
            label="Capacity"
            name="capacity"
            type="number"
            min="0"
            value={wardForm.capacity}
            onChange={updateForm(setWardForm)}
          />

          <Field
            label="Status"
            name="status"
            value={wardForm.status}
            onChange={updateForm(setWardForm)}
            required
          />

          <div className="ip-form-actions">
            <button className="ip-button" type="submit">
              {editingWardId ? "Update Ward" : "Create Ward"}
            </button>

            {editingWardId && (
              <button
                className="ip-button ip-button-light"
                type="button"
                onClick={() => {
                  setWardForm(emptyWard);
                  setEditingWardId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="ip-card">
        <h2>Ward List</h2>

        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Ward Name", key: "wardName" },
            { label: "Type", key: "wardType" },
            {
              label: "Department",
              render: (row) =>
                row.department?.departmentName ??
                row.department?.name ??
                row.department?.id ??
                "—",
            },
            { label: "Floor", key: "floor" },
            { label: "Capacity", key: "capacity" },
            { label: "Status", key: "status" },
            {
              label: "Action",
              render: (row) => (
                <button
                  type="button"
                  className="ip-button ip-button-small"
                  onClick={() => {
                    setEditingWardId(row.id);

                    setWardForm({
                      departmentId: String(
                        row.department?.id ?? ""
                      ),
                      wardName: row.wardName ?? "",
                      wardType: row.wardType ?? "",
                      floor: row.floor ?? "",
                      capacity: row.capacity ?? "",
                      status: row.status ?? "",
                    });
                  }}
                >
                  Edit
                </button>
              ),
            },
          ]}
          rows={wards}
        />
      </section>
    </>
  );

  const renderRooms = () => (
    <>
      <section className="ip-card">
        <h2>{editingRoomId ? "Update Room" : "Create Room"}</h2>

        <form className="ip-form" onSubmit={submitRoom}>
          <SelectField
            label="Ward"
            name="wardId"
            value={roomForm.wardId}
            onChange={updateForm(setRoomForm)}
            options={wardOptions}
            required
          />

          <Field
            label="Room Number"
            name="roomNumber"
            value={roomForm.roomNumber}
            onChange={updateForm(setRoomForm)}
            required
          />

          <Field
            label="Room Type"
            name="roomType"
            value={roomForm.roomType}
            onChange={updateForm(setRoomForm)}
          />

          <Field
            label="Floor"
            name="floor"
            value={roomForm.floor}
            onChange={updateForm(setRoomForm)}
          />

          <Field
            label="Daily Charge"
            name="dailyCharge"
            type="number"
            min="0"
            step="0.01"
            value={roomForm.dailyCharge}
            onChange={updateForm(setRoomForm)}
          />

          <Field
            label="Status"
            name="status"
            value={roomForm.status}
            onChange={updateForm(setRoomForm)}
            required
          />

          <div className="ip-form-actions">
            <button className="ip-button" type="submit">
              {editingRoomId ? "Update Room" : "Create Room"}
            </button>

            {editingRoomId && (
              <button
                className="ip-button ip-button-light"
                type="button"
                onClick={() => {
                  setRoomForm(emptyRoom);
                  setEditingRoomId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="ip-card">
        <h2>Room List</h2>

        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Room No.", key: "roomNumber" },
            { label: "Type", key: "roomType" },
            {
              label: "Ward",
              render: (row) =>
                row.ward?.wardName ?? row.ward?.id ?? "—",
            },
            { label: "Floor", key: "floor" },
            { label: "Daily Charge", key: "dailyCharge" },
            { label: "Status", key: "status" },
            {
              label: "Action",
              render: (row) => (
                <button
                  type="button"
                  className="ip-button ip-button-small"
                  onClick={() => {
                    setEditingRoomId(row.id);

                    setRoomForm({
                      wardId: String(row.ward?.id ?? ""),
                      roomNumber: row.roomNumber ?? "",
                      roomType: row.roomType ?? "",
                      floor: row.floor ?? "",
                      dailyCharge: row.dailyCharge ?? "",
                      status: row.status ?? "",
                    });
                  }}
                >
                  Edit
                </button>
              ),
            },
          ]}
          rows={rooms}
        />
      </section>
    </>
  );

  const renderBeds = () => (
    <>
      <section className="ip-card">
        <h2>{editingBedId ? "Update Bed" : "Create Bed"}</h2>

        <form className="ip-form" onSubmit={submitBed}>
          <SelectField
            label="Room"
            name="roomId"
            value={bedForm.roomId}
            onChange={updateForm(setBedForm)}
            options={roomOptions}
            required
          />

          <Field
            label="Bed Number"
            name="bedNumber"
            value={bedForm.bedNumber}
            onChange={updateForm(setBedForm)}
            required
          />

          <Field
            label="Bed Type"
            name="bedType"
            value={bedForm.bedType}
            onChange={updateForm(setBedForm)}
          />

          <SelectField
            label="Status"
            name="status"
            value={bedForm.status}
            onChange={updateForm(setBedForm)}
            options={[
              { value: "AVAILABLE", label: "AVAILABLE" },
              { value: "OCCUPIED", label: "OCCUPIED" },
            ]}
            required
          />

          <div className="ip-form-actions">
            <button className="ip-button" type="submit">
              {editingBedId ? "Update Bed" : "Create Bed"}
            </button>

            {editingBedId && (
              <button
                className="ip-button ip-button-light"
                type="button"
                onClick={() => {
                  setBedForm(emptyBed);
                  setEditingBedId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="ip-card">
        <h2>Bed List</h2>

        <DataTable
          columns={[
            { label: "ID", key: "id" },
            { label: "Bed Number", key: "bedNumber" },
            { label: "Type", key: "bedType" },
            {
              label: "Room",
              render: (row) =>
                row.room?.roomNumber ?? row.room?.id ?? "—",
            },
            {
              label: "Ward",
              render: (row) =>
                row.room?.ward?.wardName ??
                row.room?.ward?.id ??
                "—",
            },
            { label: "Status", key: "status" },
            {
              label: "Action",
              render: (row) => (
                <button
                  type="button"
                  className="ip-button ip-button-small"
                  onClick={() => {
                    setEditingBedId(row.id);

                    setBedForm({
                      roomId: String(row.room?.id ?? ""),
                      bedNumber: row.bedNumber ?? "",
                      bedType: row.bedType ?? "",
                      status: row.status ?? "",
                    });
                  }}
                >
                  Edit
                </button>
              ),
            },
          ]}
          rows={beds}
        />
      </section>
    </>
  );

  const renderAllocations = () => (
    <>
      <section className="ip-card">
        <h2>Allocate Bed</h2>

        <p className="ip-help">
          Only beds whose current status is AVAILABLE are listed here.
        </p>

        <form className="ip-form" onSubmit={submitAllocation}>
          <SelectField
            label="Admission"
            name="admissionId"
            value={allocationForm.admissionId}
            onChange={(event) => {
              const selectedAdmissionId = event.target.value;

              const selectedAdmission = admissions.find(
                (admission) =>
                  String(getAdmissionId(admission)) ===
                  selectedAdmissionId
              );

              setAllocationForm((previous) => ({
                ...previous,
                admissionId: selectedAdmissionId,
                patientId: String(
                  selectedAdmission?.patient?.id ??
                    previous.patientId
                ),
              }));
            }}
            options={admissions
              .map((admission) => {
                const id = getAdmissionId(admission);

                if (id == null) return null;

                return {
                  value: String(id),
                  label: `${
                    admission.admissionNumber || `Admission ${id}`
                  } — ${personName(admission.patient)}`,
                };
              })
              .filter(Boolean)}
            required
          />

          <SelectField
            label="Patient"
            name="patientId"
            value={allocationForm.patientId}
            onChange={updateForm(setAllocationForm)}
            options={patientOptions}
            required
          />

          <SelectField
            label="Available Bed"
            name="bedId"
            value={allocationForm.bedId}
            onChange={updateForm(setAllocationForm)}
            options={availableBedOptions}
            required
          />

          <button className="ip-button" type="submit">
            Allocate Bed
          </button>
        </form>
      </section>

      <section className="ip-card">
        <h2>Allocation History</h2>

        <form className="ip-search" onSubmit={searchAllocations}>
          <SelectField
            label="Search By"
            name="allocationSearchType"
            value={allocationSearchType}
            onChange={(event) =>
              setAllocationSearchType(event.target.value)
            }
            options={[
              { value: "patient", label: "Patient ID" },
              { value: "admission", label: "Admission ID" },
            ]}
            required
          />

          <Field
            label={
              allocationSearchType === "patient"
                ? "Patient ID"
                : "Admission ID"
            }
            name="allocationSearchId"
            type="number"
            min="1"
            value={allocationSearchId}
            onChange={(event) =>
              setAllocationSearchId(event.target.value)
            }
            required
          />

          <button className="ip-button" type="submit">
            Search Allocations
          </button>
        </form>

        <DataTable
          columns={[
            { label: "Allocation ID", key: "id" },
            {
              label: "Admission",
              render: (row) =>
                row.admission?.admissionNumber ??
                row.admission?.id ??
                "—",
            },
            {
              label: "Patient",
              render: (row) => personName(row.patient),
            },
            {
              label: "Bed",
              render: (row) =>
                row.bed?.bedNumber ?? row.bed?.id ?? "—",
            },
            {
              label: "Room",
              render: (row) =>
                row.bed?.room?.roomNumber ??
                row.bed?.room?.id ??
                "—",
            },
            { label: "Allocated At", key: "allocatedAt" },
            { label: "Released At", key: "releasedAt" },
            { label: "Status", key: "status" },
            {
              label: "Action",
              render: (row) =>
                row.status === "ACTIVE" ? (
                  <button
                    type="button"
                    className="ip-button ip-button-small ip-button-danger"
                    onClick={() =>
                      perform(
                        () => inpatient.releaseBed(row.id),
                        "Bed allocation released."
                      )
                    }
                  >
                    Release Bed
                  </button>
                ) : (
                  "—"
                ),
            },
          ]}
          rows={allocationHistory}
        />
      </section>
    </>
  );

  return (
    <main className="ip-page">
      <header className="ip-header">
        <div>
          <p className="ip-eyebrow">HOSPITAL OPERATIONS</p>
          <h1>Inpatient Management</h1>
          <p>
            Manage admissions, wards, rooms, beds, and allocations.
          </p>
        </div>

        <button
          type="button"
          className="ip-button ip-button-light"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </header>

      {error && (
        <div className="ip-alert ip-alert-error">{error}</div>
      )}

      {message && (
        <div className="ip-alert ip-alert-success">{message}</div>
      )}

      <nav className="ip-tabs">
        {tabItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`ip-tab ${
              activeTab === id ? "active" : ""
            }`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "admissions" && renderAdmissions()}
      {activeTab === "wards" && renderWards()}
      {activeTab === "rooms" && renderRooms()}
      {activeTab === "beds" && renderBeds()}
      {activeTab === "allocations" && renderAllocations()}
    </main>
  );
}

function AssignmentForm({
  admissions = [],
  doctors = [],
  wards = [],
  onAssignDoctor,
  onAssignWard,
}) {
  // Keep doctor and ward selections independent.
  const [doctorAdmissionId, setDoctorAdmissionId] = useState("");
  const [wardAdmissionId, setWardAdmissionId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [wardId, setWardId] = useState("");

  // Normalize admission objects into valid select options.
  const admissionOptions = asList(admissions)
    .filter((admission) => admission && typeof admission === "object")
    .map((admission) => {
      const id = getAdmissionId(admission);
      if (id === null || id === undefined || id === "") return null;

      const admissionNumber = admission.admissionNumber || `Admission ${id}`;
      const patient = personName(admission.patient ?? admission.patientDetails);

      return {
        value: String(id),
        label: `${admissionNumber} — ${patient}`,
      };
    })
    .filter((option) => option !== null);

  const doctorOptions = asList(doctors)
    .filter((doctor) => doctor?.id != null)
    .map((doctor) => ({
      value: String(doctor.id),
      label: `${personName(doctor)} (ID ${doctor.id})`,
    }));

  const wardOptions = asList(wards)
    .filter((ward) => ward?.id != null)
    .map((ward) => ({
      value: String(ward.id),
      label: `${ward.wardName || "Ward"} (ID ${ward.id})`,
    }));

  const handleAssignDoctor = (event) => {
    event.preventDefault();

    if (!doctorAdmissionId || !doctorId) return;

    onAssignDoctor(
      Number(doctorAdmissionId),
      Number(doctorId)
    );
  };

  const handleAssignWard = (event) => {
    event.preventDefault();

    if (!wardAdmissionId || !wardId) return;

    onAssignWard(
      Number(wardAdmissionId),
      Number(wardId)
    );
  };

  return (
    <div className="ip-assignment-grid">
      <form
        className="ip-form"
        onSubmit={handleAssignDoctor}
      >
        <h3>Assign Doctor</h3>

        <SelectField
          label="Admission"
          name="doctorAdmissionId"
          value={doctorAdmissionId}
          onChange={(event) =>
            setDoctorAdmissionId(event.target.value)
          }
          options={admissionOptions}
          required
        />

        <SelectField
          label="Doctor"
          name="doctorId"
          value={doctorId}
          onChange={(event) => setDoctorId(event.target.value)}
          options={doctorOptions}
          required
        />

        {admissionOptions.length === 0 && (
          <p className="ip-help">
            No admissions available. Refresh the page and check that
            admissions are returned by the backend.
          </p>
        )}

        <button
          className="ip-button"
          type="submit"
          disabled={
            admissionOptions.length === 0 ||
            doctorOptions.length === 0
          }
        >
          Assign Doctor
        </button>
      </form>

      <form
        className="ip-form"
        onSubmit={handleAssignWard}
      >
        <h3>Assign Ward</h3>

        <SelectField
          label="Admission"
          name="wardAdmissionId"
          value={wardAdmissionId}
          onChange={(event) =>
            setWardAdmissionId(event.target.value)
          }
          options={admissionOptions}
          required
        />

        <SelectField
          label="Ward"
          name="wardId"
          value={wardId}
          onChange={(event) => setWardId(event.target.value)}
          options={wardOptions}
          required
        />

        {admissionOptions.length === 0 && (
          <p className="ip-help">
            No admissions available. Refresh the page and check that
            admissions are returned by the backend.
          </p>
        )}

        <button
          className="ip-button"
          type="submit"
          disabled={
            admissionOptions.length === 0 ||
            wardOptions.length === 0
          }
        >
          Assign Ward
        </button>
      </form>
    </div>
  );
}