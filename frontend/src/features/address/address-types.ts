export interface Address {
  id: string;
  user_id: string;
  label: string;
  address_line: string;
  area: string | null;
  city: string;
  province: string;
  phone: string;
  delivery_notes: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressesResponse {
  success: boolean;
  addresses: Address[];
}

export interface AddressResponse {
  success: boolean;
  message: string;
  address: Address;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export type AddressFormValues = {
  label: string;
  address_line: string;
  area: string;
  city: string;
  province: string;
  phone: string;
  delivery_notes: string;
  is_default: boolean;
};
