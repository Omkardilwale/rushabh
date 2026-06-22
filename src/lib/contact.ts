import { getSiteConfig } from "./site-config";

export function getEnquiryEmail() {
  return getSiteConfig().enquiryEmail;
}

export function getWhatsappNumber() {
  return getSiteConfig().whatsappNumber;
}

export function getContactPhone() {
  return getSiteConfig().contactPhone;
}
