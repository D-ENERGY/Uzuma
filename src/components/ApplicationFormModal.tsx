import React, { useMemo, useState } from "react";
import {
  type ApplicationFormData,
  type City,
  PROPERTY_OPTIONS_BY_CITY,
  type SubmitStatus,
  createDefaultFormData,
} from "../types/applicationForm";

type Props = {
  city: City;
  open: boolean;
  onClose: () => void;
};

const PASSPORT_MAX_SIZE_BYTES = 2 * 1024 * 1024;

function validate(data: ApplicationFormData): string | null {
  if (data.passportPhoto && data.passportPhoto.size > PASSPORT_MAX_SIZE_BYTES) {
    return "Passport photograph must not be more than 2MB.";
  }
  if (!data.passportPhoto) return "Please upload AFFIX PASSPORT PHOTOGRAPH.";
  if (!data.title.trim()) return "Please enter Title.";
  if (!data.firstName.trim()) return "Please enter your first name.";
  if (!data.othernames.trim()) return "Please enter your othernames.";
  if (!data.companyName.trim()) return "Please enter Company Name (If Applicable).";
  if (!data.rcNo.trim()) return "Please enter RC No.";
  if (!data.contactAddress.trim()) return "Please enter your contact address.";
  if (!data.postalAddress.trim()) return "Please enter Postal Address.";
  if (!data.emailAddress.trim()) return "Please enter your email address.";
  if (!data.contactNo.trim()) return "Please enter your contact number.";
  if (!data.nok.trim()) return "Please enter NOK.";
  if (!data.gsmNo.trim()) return "Please enter GSM No.";
  if (!data.allocatedProperty.trim()) return "Please enter SECTION D: ALLOCATED PROPERTY.";
  if (!data.acceptedTerms) return "You must accept the terms and conditions.";
  if (!data.applicantName.trim()) return "Please enter your name (declaration).";
  if (!data.signatureFile) return "Please upload your signature.";
  if (!data.appointmentRef.trim()) return "Please enter Appt.";
  if (!data.date.trim()) return "Please enter the date.";
  return null;
}

export function ApplicationFormModal({ city, open, onClose }: Props) {
  const [data, setData] = useState<ApplicationFormData>(() =>
    createDefaultFormData(city),
  );
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [showValidation, setShowValidation] = useState(false);
  const [passportPreviewSrc, setPassportPreviewSrc] = useState("");
  const [signaturePreviewSrc, setSignaturePreviewSrc] = useState("");

  const propertyOptions = useMemo(
    () => PROPERTY_OPTIONS_BY_CITY[city],
    [city],
  );
  React.useEffect(() => {
    if (!data.passportPhoto) {
      setPassportPreviewSrc("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPassportPreviewSrc(String(reader.result ?? ""));
    reader.onerror = () => setPassportPreviewSrc("");
    reader.readAsDataURL(data.passportPhoto);
    return () => {
      reader.abort();
    };
  }, [data.passportPhoto]);

  React.useEffect(() => {
    if (!data.signatureFile) {
      setSignaturePreviewSrc("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSignaturePreviewSrc(String(reader.result ?? ""));
    reader.onerror = () => setSignaturePreviewSrc("");
    reader.readAsDataURL(data.signatureFile);
    return () => {
      reader.abort();
    };
  }, [data.signatureFile]);

  React.useEffect(() => {
    setData(createDefaultFormData(city));
    setStatus({ state: "idle" });
    setView("edit");
    setShowValidation(false);
  }, [city, open]);

  React.useEffect(() => {
    if (status.state !== "success") return;
    const timer = window.setTimeout(() => {
      setStatus({ state: "idle" });
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (!open) return null;

  const accent = city === "greenhills" ? "Greenhills City" : "Whitehills City";
  const titleText = "APPLICATION FORM";

  async function handleFinalSubmit() {
    setShowValidation(true);
    setStatus({ state: "idle" });

    const error = validate(data);
    if (error) {
      setStatus({ state: "error", message: error });
      return;
    }

    setStatus({ state: "submitting" });

    try {
      const payload = new FormData();
      (Object.keys(data) as (keyof ApplicationFormData)[]).forEach((key) => {
        const value = data[key];
        if (key === "passportPhoto" || key === "signatureFile") return;
        payload.append(String(key), String(value));
      });
      if (data.passportPhoto) payload.append("passportPhoto", data.passportPhoto);
      if (data.signatureFile) payload.append("signatureFile", data.signatureFile);

      // Ready for API integration:
      // - create payment intent (Paystack/Flutterwave) then submit payload + payment reference
      // - or submit payload first, return an invoice/checkout link
      await new Promise((r) => setTimeout(r, 450));

      setStatus({ state: "success", reference: "PENDING-INTEGRATION" });
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong. Try again.",
      });
    }
  }

  function handleGoPreview() {
    setShowValidation(true);
    setStatus({ state: "idle" });
    const error = validate(data);
    if (error) {
      setStatus({ state: "error", message: error });
      return;
    }
    setView("preview");
  }

  const propertyPreviewOptions = propertyOptions.map((o) => ({
    ...o,
    checked: o.value === data.propertyType,
  }));
  const invalid = {
    passportPhoto: !data.passportPhoto,
    title: !data.title.trim(),
    firstName: !data.firstName.trim(),
    othernames: !data.othernames.trim(),
    companyName: !data.companyName.trim(),
    rcNo: !data.rcNo.trim(),
    contactAddress: !data.contactAddress.trim(),
    postalAddress: !data.postalAddress.trim(),
    emailAddress: !data.emailAddress.trim(),
    contactNo: !data.contactNo.trim(),
    nok: !data.nok.trim(),
    gsmNo: !data.gsmNo.trim(),
    allocatedProperty: !data.allocatedProperty.trim(),
    acceptedTerms: !data.acceptedTerms,
    applicantName: !data.applicantName.trim(),
    signatureFile: !data.signatureFile,
    appointmentRef: !data.appointmentRef.trim(),
    date: !data.date.trim(),
  };

  return (
    <div
      className="application-modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="application-modal">
        <div className="application-modal-header">
          <div className="application-modal-title">
            {titleText} — {accent}
          </div>
          <button
            type="button"
            className="application-modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            Close
          </button>
        </div>

        <div className="application-form">
          <div className="application-instruction">
            PLEASE FILL THE FORM IN CAPITAL LETTERS.
          </div>
          {view === "preview" ? (
            <div className="application-preview">
              <div className="application-preview-paper">
                <div className="application-preview-top">
                  <div className="application-preview-passport">
                    {passportPreviewSrc ? (
                      <img
                        src={passportPreviewSrc}
                        alt="Passport preview"
                        className="application-preview-passport-image"
                      />
                    ) : (
                      <>
                        <div className="application-preview-passport-label">
                          AFFIX PASSPORT
                          <br />
                          PHOTOGRAPH
                        </div>
                        <div className="application-preview-passport-file">
                          {data.passportPhoto?.name ?? ""}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="application-preview-heading">
                    <div className="application-preview-title-text">APPLICATION FORM</div>
                  </div>
                </div>

                <div className="application-preview-section-title">
                  SECTION A: PERSONAL DATA
                </div>

                <div className="application-preview-line application-preview-line-3">
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">Title</div>
                    <div className="application-preview-value-line">{data.title}</div>
                  </div>
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">First Name</div>
                    <div className="application-preview-value-line">{data.firstName}</div>
                  </div>
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">Othernames</div>
                    <div className="application-preview-value-line">{data.othernames}</div>
                  </div>
                </div>

                <div className="application-preview-line application-preview-line-3">
                  <div className="application-preview-choice">
                    <span className={`application-preview-box ${data.serviceGroup === "military" ? "checked" : ""}`} />
                    <span>Military</span>
                  </div>
                  <div className="application-preview-choice">
                    <span className={`application-preview-box ${data.serviceGroup === "paramilitary" ? "checked" : ""}`} />
                    <span>Paramilitary</span>
                  </div>
                  <div className="application-preview-choice">
                    <span className={`application-preview-box ${data.serviceGroup === "civilian" ? "checked" : ""}`} />
                    <span>Civilian</span>
                  </div>
                </div>

                <div className="application-preview-line application-preview-line-2">
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">
                      Company Name (If Applicable)
                    </div>
                    <div className="application-preview-value-line">{data.companyName}</div>
                  </div>
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">RC No</div>
                    <div className="application-preview-value-line">{data.rcNo}</div>
                  </div>
                </div>

                <div className="application-preview-block">
                  <div className="application-preview-label-inline">Contact Address</div>
                  <div className="application-preview-value-block">{data.contactAddress}</div>
                </div>

                <div className="application-preview-block">
                  <div className="application-preview-label-inline">Postal Address</div>
                  <div className="application-preview-value-block">{data.postalAddress}</div>
                </div>

                <div className="application-preview-line application-preview-line-2">
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">Email Address</div>
                    <div className="application-preview-value-line">{data.emailAddress}</div>
                  </div>
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">Contact No</div>
                    <div className="application-preview-value-line">{data.contactNo}</div>
                  </div>
                </div>

                <div className="application-preview-line application-preview-line-2">
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">NOK</div>
                    <div className="application-preview-value-line">{data.nok}</div>
                  </div>
                  <div className="application-preview-field">
                    <div className="application-preview-label-inline">GSM No</div>
                    <div className="application-preview-value-line">{data.gsmNo}</div>
                  </div>
                </div>

                <div className="application-preview-section-title">
                  SECTION B: PAYMENT PLAN
                </div>
                <div className="application-preview-line application-preview-payment">
                  <div className="application-preview-choice">
                    <span className={`application-preview-box ${data.paymentPlan === "full" ? "checked" : ""}`} />
                    <span>Full Payment</span>
                  </div>
                  <div className="application-preview-choice">
                    <span className={`application-preview-box ${data.paymentPlan === "installmental" ? "checked" : ""}`} />
                    <span>Installmental Payment</span>
                  </div>
                </div>

                <div className="application-preview-section-title">
                  SECTION C: PROPERTY TYPE
                </div>
                <div className="application-preview-property-grid">
                  {propertyPreviewOptions.map((o) => (
                    <div className="application-preview-choice" key={o.value}>
                      <span className={`application-preview-box ${o.checked ? "checked" : ""}`} />
                      <span>{o.label}</span>
                    </div>
                  ))}
                </div>

                <div className="application-preview-section-title">
                  SECTION D: ALLOCATED PROPERTY
                </div>
                <div className="application-preview-value-line application-preview-allocated">
                  {data.allocatedProperty}
                </div>

                <div className="application-preview-fee">
                  ₦100,000.00 Non-refundable application form
                  <br />
                  and processing fees
                </div>

                <div className="application-preview-signature">
                  <div className="application-preview-line application-preview-line-4">
                    <div className="application-preview-field">
                      <div className="application-preview-label-inline">Name</div>
                      <div className="application-preview-value-line">{data.applicantName}</div>
                    </div>
                    <div className="application-preview-field">
                      <div className="application-preview-label-inline">Signature</div>
                      <div className="application-preview-signature-box">
                        {signaturePreviewSrc &&
                        data.signatureFile?.type.startsWith("image/") ? (
                          <img
                            src={signaturePreviewSrc}
                            alt="Signature preview"
                            className="application-preview-signature-image"
                          />
                        ) : (
                          <div className="application-preview-signature-file">
                            {data.signatureFile?.name ?? ""}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="application-preview-field">
                      <div className="application-preview-label-inline">Appt.</div>
                      <div className="application-preview-value-line">{data.appointmentRef}</div>
                    </div>
                    <div className="application-preview-field">
                      <div className="application-preview-label-inline">Date</div>
                      <div className="application-preview-value-line">{data.date}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="application-actions">
                <button
                  type="button"
                  className="application-secondary"
                  onClick={() => setView("edit")}
                  disabled={status.state === "submitting"}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="application-primary"
                  onClick={() => void handleFinalSubmit()}
                  disabled={status.state === "submitting" || !data.acceptedTerms}
                >
                  {status.state === "submitting"
                    ? "Submitting…"
                    : "Confirm & Submit"}
                </button>
              </div>

              {status.state === "error" ? (
                <div className="application-error">{status.message}</div>
              ) : null}
              {status.state === "success" ? (
                <div className="application-success-overlay" role="status" aria-live="polite">
                  <div className="application-success-popup">
                    Submitted. Reference: {status.reference ?? "N/A"}.
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="application-form-grid">
            <section className="application-panel">
              <h3>SECTION A: PERSONAL DATA</h3>

              <div className="application-field" style={{ marginBottom: 12 }}>
                <label className="required-label" htmlFor="passportPhoto">AFFIX PASSPORT PHOTOGRAPH</label>
                <input
                  className={showValidation && invalid.passportPhoto ? "field-invalid" : ""}
                  id="passportPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    (() => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > PASSPORT_MAX_SIZE_BYTES) {
                        setStatus({
                          state: "error",
                          message:
                            "Passport photograph must not be more than 2MB.",
                        });
                        setData({ ...data, passportPhoto: null });
                        e.currentTarget.value = "";
                        return;
                      }
                      setStatus({ state: "idle" });
                      setData({
                        ...data,
                        passportPhoto: file,
                      });
                    })()
                  }
                />
                <div className="application-note">Maximum passport size: 2MB</div>
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="title">Title</label>
                  <input
                    className={showValidation && invalid.title ? "field-invalid" : ""}
                    id="title"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="firstName">First Name</label>
                  <input
                    className={showValidation && invalid.firstName ? "field-invalid" : ""}
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) =>
                      setData({ ...data, firstName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="othernames">Othernames</label>
                  <input
                    className={showValidation && invalid.othernames ? "field-invalid" : ""}
                    id="othernames"
                    value={data.othernames}
                    onChange={(e) =>
                      setData({ ...data, othernames: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label>&nbsp;</label>
                  <div className="application-choice">
                    <label>
                      <input
                        type="radio"
                        name="serviceGroup"
                        value="military"
                        checked={data.serviceGroup === "military"}
                        onChange={() =>
                          setData({ ...data, serviceGroup: "military" })
                        }
                      />
                      Military
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="serviceGroup"
                        value="paramilitary"
                        checked={data.serviceGroup === "paramilitary"}
                        onChange={() =>
                          setData({ ...data, serviceGroup: "paramilitary" })
                        }
                      />
                      Paramilitary
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="serviceGroup"
                        value="civilian"
                        checked={data.serviceGroup === "civilian"}
                        onChange={() =>
                          setData({ ...data, serviceGroup: "civilian" })
                        }
                      />
                      Civilian
                    </label>
                  </div>
                </div>
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="companyName">Company Name (If Applicable)</label>
                  <input
                    className={showValidation && invalid.companyName ? "field-invalid" : ""}
                    id="companyName"
                    value={data.companyName}
                    onChange={(e) =>
                      setData({ ...data, companyName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="rcNo">RC No</label>
                  <input
                    className={showValidation && invalid.rcNo ? "field-invalid" : ""}
                    id="rcNo"
                    value={data.rcNo}
                    onChange={(e) => setData({ ...data, rcNo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="application-field" style={{ marginBottom: 12 }}>
                <label className="required-label" htmlFor="contactAddress">Contact Address</label>
                <textarea
                  className={showValidation && invalid.contactAddress ? "field-invalid" : ""}
                  id="contactAddress"
                  value={data.contactAddress}
                  onChange={(e) =>
                    setData({ ...data, contactAddress: e.target.value })
                  }
                  required
                />
              </div>

              <div className="application-field" style={{ marginBottom: 12 }}>
                <label className="required-label" htmlFor="postalAddress">Postal Address</label>
                <input
                  className={showValidation && invalid.postalAddress ? "field-invalid" : ""}
                  id="postalAddress"
                  value={data.postalAddress}
                  onChange={(e) =>
                    setData({ ...data, postalAddress: e.target.value })
                  }
                  required
                />
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="emailAddress">Email Address</label>
                  <input
                    className={showValidation && invalid.emailAddress ? "field-invalid" : ""}
                    id="emailAddress"
                    type="email"
                    value={data.emailAddress}
                    onChange={(e) =>
                      setData({ ...data, emailAddress: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="contactNo">Contact No</label>
                  <input
                    className={showValidation && invalid.contactNo ? "field-invalid" : ""}
                    id="contactNo"
                    value={data.contactNo}
                    onChange={(e) =>
                      setData({ ...data, contactNo: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="nok">NOK</label>
                  <input
                    className={showValidation && invalid.nok ? "field-invalid" : ""}
                    id="nok"
                    value={data.nok}
                    onChange={(e) =>
                      setData({ ...data, nok: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="gsmNo">GSM No</label>
                  <input
                    className={showValidation && invalid.gsmNo ? "field-invalid" : ""}
                    id="gsmNo"
                    value={data.gsmNo}
                    onChange={(e) => setData({ ...data, gsmNo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <h3 style={{ marginTop: 14 }}>SECTION B: PAYMENT PLAN</h3>
              <div className="application-choice">
                <label>
                  <input
                    type="radio"
                    name="paymentPlan"
                    value="full"
                    checked={data.paymentPlan === "full"}
                    onChange={() => setData({ ...data, paymentPlan: "full" })}
                  />
                  Full Payment
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentPlan"
                    value="installmental"
                    checked={data.paymentPlan === "installmental"}
                    onChange={() =>
                      setData({ ...data, paymentPlan: "installmental" })
                    }
                  />
                  Installmental Payment
                </label>
              </div>

              <h3 style={{ marginTop: 14 }}>SECTION C: PROPERTY TYPE</h3>
              <div className="application-field">
                <select
                  id="propertyType"
                  value={data.propertyType}
                  onChange={(e) =>
                    setData({
                      ...data,
                      propertyType: e.target.value as ApplicationFormData["propertyType"],
                    })
                  }
                >
                  {propertyOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <h3 style={{ marginTop: 14 }}>SECTION D: ALLOCATED PROPERTY</h3>
              <div className="application-field">
                <input
                  className={showValidation && invalid.allocatedProperty ? "field-invalid" : ""}
                  id="allocatedProperty"
                  value={data.allocatedProperty}
                  onChange={(e) =>
                    setData({ ...data, allocatedProperty: e.target.value })
                  }
                  required
                />
              </div>

              <p className="application-note">
                ₦100,000.00 Non-refundable application form and processing fees
              </p>
            </section>

            <section className="application-panel">
              <h3>SECTION E: TERMS AND CONDITIONS</h3>
              <ol className="application-terms">
                <li>
                  Subscribers are to pay for deed of sublease to be determined by FCDA
                </li>
                <li>
                  To pay in advance and without demand to the Jumong Projects Ltd (herein after referred to as Jumong, or any other agent appointed by Jumong the revised annual facility management fee or tenement fee from the first day of January of each year as to be imposed by relevant authorities.
                </li>
                <li>
                  To pay and discharge all rates (including utilities), assessments and levies, whatsoever which shall at any time be charged or imposed on the said property or any part thereof or upon the occupier or occupiers thereof from Jumong or agreed SPV.
                </li>
                <li>
                  To maintain in good and substantial repair to the satisfaction of Jumong or any other agent appointed by Jumong, the PROPERTY and appurtenances thereto, and to keep the building/property maintained in clean and good sanitary condition.
                </li>
                <li>
                  Not to erect or build or permit to be erected or build on the land, any other structure or buildings other than those permitted to be erected by virtue of this letter of allocation.
                </li>
                <li>
                  The Directors of Jumong or any of its managers/consultants duly authorized by the Directors on their behalf shall have the power to enter into and inspect the property in this letter of allocation on any improvements effected thereon at any reasonable hour during the day.
                </li>
                <li>
                  Not to alienate the letter of allocation hereby granted or any part thereof by sale, assignment, mortgage, transfer of possession, sub-lease or bequest, or otherwise without the prior consent of Jumong.
                </li>
                <li>
                  To use the said building for Jumong approved purposes only or other lawful purposes but not to the detriment or disturbance of other subscribers/tenants.
                </li>
                <li>
                  Not to contravene any of the provisions of the Land Use Act No. 6 of 1978 and to conform and comply with all rules and regulations laid down from time to time by Jumong or as may be agreed by all parties on the said land but with the consent of Jumong or agreed authority.
                </li>
                <li>
                  The allocation is for 99 years with effect from date as indicated on the C of O.
                </li>
              </ol>

              <div className="application-field" style={{ marginTop: 12 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={data.acceptedTerms}
                    onChange={(e) =>
                      setData({ ...data, acceptedTerms: e.target.checked })
                    }
                    required
                    style={{ marginRight: 10 }}
                  />
                  <span className={showValidation && invalid.acceptedTerms ? "required-label field-invalid-text" : "required-label"}>I hereby declare that the details provided above are true. That I fully agree with the conditions under which the unit will be allocated to me/my company.</span>
                </label>
              </div>

              <h3 style={{ marginTop: 14 }}>Declaration by Applicant</h3>
              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="applicantName">Name</label>
                  <input
                    className={showValidation && invalid.applicantName ? "field-invalid" : ""}
                    id="applicantName"
                    value={data.applicantName}
                    onChange={(e) =>
                      setData({ ...data, applicantName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="signatureFile">Signature</label>
                  <input
                    className={showValidation && invalid.signatureFile ? "field-invalid" : ""}
                    id="signatureFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setData({
                        ...data,
                        signatureFile: e.target.files?.[0] ?? null,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="application-row">
                <div className="application-field">
                  <label className="required-label" htmlFor="appointmentRef">Appt.</label>
                  <input
                    className={showValidation && invalid.appointmentRef ? "field-invalid" : ""}
                    id="appointmentRef"
                    value={data.appointmentRef}
                    onChange={(e) =>
                      setData({ ...data, appointmentRef: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="application-field">
                  <label className="required-label" htmlFor="date">Date</label>
                  <input
                    className={showValidation && invalid.date ? "field-invalid" : ""}
                    id="date"
                    type="date"
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <h3 style={{ marginTop: 14 }}>FOR OFFICIAL USE ONLY</h3>
              <div className="application-row">
                <div className="application-field">
                  <label>APPROVED</label>
                  <input disabled value="" />
                </div>
                <div className="application-field">
                  <label>NOT APPROVED</label>
                  <input disabled value="" />
                </div>
              </div>
              <div className="application-field" style={{ marginBottom: 12 }}>
                <label>PROPERTY ALLOCATED</label>
                <input disabled value="" />
              </div>
              <div className="application-field" style={{ marginBottom: 12 }}>
                <label>Other Comments</label>
                <input disabled value="" />
              </div>

              <div className="application-actions">
                <button
                  type="button"
                  className="application-secondary"
                  onClick={() => {
                    setData(createDefaultFormData(city));
                    setStatus({ state: "idle" });
                  }}
                  disabled={status.state === "submitting"}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="application-secondary"
                  onClick={() => {
                    handleGoPreview();
                  }}
                  disabled={status.state === "submitting"}
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="application-primary"
                  disabled={status.state === "submitting"}
                  onClick={() => {
                    handleGoPreview();
                  }}
                >
                  Continue
                </button>
              </div>

              {status.state === "error" ? (
                <div className="application-error">{status.message}</div>
              ) : null}
            </section>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

