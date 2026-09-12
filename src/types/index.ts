export type UserRole = "USER" | "CYBER_CAFE" | "SUPER_ADMIN";

export type RequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "WAITING_FOR_USER"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface TemplateField {
  id: string;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "dropdown"
    | "radio"
    | "checkbox"
    | "address"
    | "mobile"
    | "email"
    | "pincode"
    | "textarea";
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface CyberCafePricing {
  typing: number;
  assistance: number;
  printBlack: number;
  printColor: number;
  scan: number;
  lamination: number;
  [key: string]: number;
}
