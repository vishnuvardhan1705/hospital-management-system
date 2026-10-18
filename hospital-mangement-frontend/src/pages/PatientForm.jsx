import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createPatient } from "../services/patientService";
import "../styles/patients.css";

const initialForm = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
};

function getErrorMessage(error) {
    const data = error.response?.data;

    if (data?.message) return data.message;

    if (data?.errors && typeof data.errors === "object") {
        return Object.values(data.errors).join(", ");
    }

    return error.message || "Unable to register patient.";
}

export default function PatientForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const mobile = form.mobileNumber.trim();

        if (!/^\d{10}$/.test(mobile)) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }

        if (
            form.emergencyContactNumber &&
            !/^\d{10}$/.test(form.emergencyContactNumber.trim())
        ) {
            setError("Enter a valid 10-digit emergency contact number.");
            return;
        }

        const payload = {
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            mobileNumber: mobile,
            email: form.email.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            emergencyContactName: form.emergencyContactName.trim(),
            emergencyContactNumber:
                form.emergencyContactNumber.trim(),
        };

        setLoading(true);

        try {
            await createPatient(payload);
            navigate("/patients", {
                replace: true,
                state: { message: "Patient registered successfully." },
            });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="patients-page">
            <Link to="/patients" className="patient-back-link">
                <ArrowLeft size={17} />
                Back to patients
            </Link>

            <div className="patients-heading">
                <div>
                    <p className="page-eyebrow">PATIENT MANAGEMENT</p>
                    <h1>Register patient</h1>
                    <p className="page-description">
                        Enter the patient's personal and contact information.
                    </p>
                </div>
            </div>

            <form className="patient-form-card" onSubmit={handleSubmit}>
                <div className="patient-form-heading">
                    <div className="patient-summary-icon">
                        <UserPlus size={22} />
                    </div>
                    <div>
                        <h2>Personal information</h2>
                        <p>Fields marked * are required.</p>
                    </div>
                </div>

                {error && (
                    <div className="patient-alert patient-alert-error">
                        {error}
                    </div>
                )}

                <div className="patient-form-grid">
                    <div className="patient-field">
                        <label htmlFor="firstName">First name *</label>
                        <input
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="lastName">Last name *</label>
                        <input
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="dateOfBirth">Date of birth *</label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="gender">Gender *</label>
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="patient-field">
                        <label htmlFor="bloodGroup">Blood group</label>
                        <select
                            id="bloodGroup"
                            name="bloodGroup"
                            value={form.bloodGroup}
                            onChange={handleChange}
                        >
                            <option value="">Select blood group</option>
                            {[
                                "A_POSITIVE",
                                "A_NEGATIVE",
                                "B_POSITIVE",
                                "B_NEGATIVE",
                                "AB_POSITIVE",
                                "AB_NEGATIVE",
                                "O_POSITIVE",
                                "O_NEGATIVE",
                            ].map((group) => (
                                <option key={group} value={group}>
                                    {group.replace("_", " ").replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="patient-field">
                        <label htmlFor="mobileNumber">Mobile number *</label>
                        <input
                            id="mobileNumber"
                            name="mobileNumber"
                            type="tel"
                            inputMode="numeric"
                            value={form.mobileNumber}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                            autoComplete="tel"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            maxLength={150}
                            autoComplete="email"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                            id="pincode"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            maxLength={10}
                            autoComplete="postal-code"
                        />
                    </div>

                    <div className="patient-field patient-field-wide">
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            maxLength={255}
                            autoComplete="street-address"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            maxLength={100}
                            autoComplete="address-level2"
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="state">State</label>
                        <input
                            id="state"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            maxLength={100}
                            autoComplete="address-level1"
                        />
                    </div>
                </div>

                <div className="patient-form-section">
                    <h3>Emergency contact</h3>
                    <p>Contact details to use in an emergency.</p>
                </div>

                <div className="patient-form-grid">
                    <div className="patient-field">
                        <label htmlFor="emergencyContactName">
                            Contact name
                        </label>
                        <input
                            id="emergencyContactName"
                            name="emergencyContactName"
                            value={form.emergencyContactName}
                            onChange={handleChange}
                            maxLength={150}
                        />
                    </div>

                    <div className="patient-field">
                        <label htmlFor="emergencyContactNumber">
                            Contact number
                        </label>
                        <input
                            id="emergencyContactNumber"
                            name="emergencyContactNumber"
                            type="tel"
                            inputMode="numeric"
                            value={form.emergencyContactNumber}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            maxLength={10}
                        />
                    </div>
                </div>

                <div className="patient-form-actions">
                    <Link to="/patients" className="patient-cancel-btn">
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="patient-primary-btn"
                        disabled={loading}
                    >
                        <UserPlus size={18} />
                        {loading ? "Registering..." : "Register patient"}
                    </button>
                </div>
            </form>
        </section>
    );
}