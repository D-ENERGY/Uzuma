export type City = "greenhills" | "whitehills";

export type ServiceGroup = "military" | "paramilitary" | "civilian";

export type PaymentPlan = "full" | "installmental";

export type PropertyType =
  | "300sqm"
  | "600sqm"
  | "1000sqm"
  | "2000sqm-special"
  | "3000sqm-special"
  | "10000sqm-villa"
  | "commercial"
  | "building";

export interface ApplicationFormData {
  city: City;
  title: string;
  firstName: string;
  othernames: string;
  serviceGroup: ServiceGroup;
  companyName: string;
  rcNo: string;
  contactAddress: string;
  postalAddress: string;
  emailAddress: string;
  contactNo: string;
  nok: string;
  gsmNo: string;
  paymentPlan: PaymentPlan;
  propertyType: PropertyType;
  allocatedProperty: string;
  acceptedTerms: boolean;
  applicantName: string;
  signatureFile?: File | null;
  appointmentRef: string;
  date: string;
  passportPhoto?: File | null;
}

export type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference?: string }
  | { state: "error"; message: string };

export interface PropertyOption {
  value: PropertyType;
  label: string;
}

export const PROPERTY_OPTIONS_BY_CITY: Record<City, PropertyOption[]> = {
  greenhills: [
    { value: "300sqm", label: "300sqm" },
    { value: "600sqm", label: "600sqm" },
    { value: "1000sqm", label: "1000sqm" },
    { value: "2000sqm-special", label: "2000sqm (Special)" },
    { value: "3000sqm-special", label: "3000sqm (special)" },
    { value: "10000sqm-villa", label: "10,000sqm (Villa)" },
    { value: "commercial", label: "Commercial" },
    { value: "building", label: "Building" },
  ],
  whitehills: [
    { value: "300sqm", label: "300sqm" },
    { value: "600sqm", label: "600sqm" },
    { value: "1000sqm", label: "1000sqm" },
    { value: "2000sqm-special", label: "2000sqm (Special)" },
    { value: "3000sqm-special", label: "3000sqm (special)" },
    { value: "10000sqm-villa", label: "10,000sqm (Villa)" },
    { value: "commercial", label: "Commercial" },
    { value: "building", label: "Building" },
  ],
};

export function createDefaultFormData(city: City): ApplicationFormData {
  return {
    city,
    title: "",
    firstName: "",
    othernames: "",
    serviceGroup: "civilian",
    companyName: "",
    rcNo: "",
    contactAddress: "",
    postalAddress: "",
    emailAddress: "",
    contactNo: "",
    nok: "",
    gsmNo: "",
    paymentPlan: "full",
    propertyType: "300sqm",
    allocatedProperty: "",
    acceptedTerms: false,
    applicantName: "",
    signatureFile: null,
    appointmentRef: "",
    date: "",
    passportPhoto: null,
  };
}
