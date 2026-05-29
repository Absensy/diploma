export type {
  PersonalizationSymbol,
  ContactMethod,
  ServiceUnit,
  ServiceCategory,
} from '@/lib/orderLabels';
export {
  SYMBOL_LABELS,
  CONTACT_METHOD_LABELS,
  SERVICE_CATEGORY_LABELS,
  SERVICE_UNIT_LABELS,
} from '@/lib/orderLabels';
import type {
  PersonalizationSymbol,
  ContactMethod,
  ServiceUnit,
  ServiceCategory,
} from '@/lib/orderLabels';

export interface PersonalizationData {
  first_name: string;
  last_name: string;
  patronymic: string;
  birth_date: string;
  death_date: string;
  portrait_photo: string;
  epitaph: string;
  symbol: PersonalizationSymbol;
  notes: string;
}

export interface SelectedService {
  service_id: number;
  quantity: number;
}

export interface DeliveryData {
  cemetery_name: string;
  cemetery_address: string;
  city: string;
  region: string;
  contact_phone: string;
  preferred_date: string;
  comment: string;
}

export interface ContactData {
  first_name: string;
  last_name: string;
  patronymic: string;
  phone: string;
  email: string;
  address: string;
  passport_series: string;
  passport_number: string;
  passport_issued_by: string;
  passport_issued_at: string;
  personal_number: string;
  preferred_contact: ContactMethod | '';
  comment: string;
}

export interface CheckoutState {
  personalizations: Record<string, PersonalizationData>;
  services: SelectedService[];
  delivery: DeliveryData;
  contact: ContactData;
  payment_method: 'ONLINE' | 'OFFLINE';
}

export interface AdditionalServiceDTO {
  id: number;
  name: string;
  description: string | null;
  price: number;
  unit: ServiceUnit;
  category: ServiceCategory;
}

export const emptyPersonalization = (): PersonalizationData => ({
  first_name: '',
  last_name: '',
  patronymic: '',
  birth_date: '',
  death_date: '',
  portrait_photo: '',
  epitaph: '',
  symbol: 'NONE',
  notes: '',
});

export const emptyDelivery = (): DeliveryData => ({
  cemetery_name: '',
  cemetery_address: '',
  city: '',
  region: '',
  contact_phone: '',
  preferred_date: '',
  comment: '',
});

export const emptyContact = (): ContactData => ({
  first_name: '',
  last_name: '',
  patronymic: '',
  phone: '',
  email: '',
  address: '',
  passport_series: '',
  passport_number: '',
  passport_issued_by: '',
  passport_issued_at: '',
  personal_number: '',
  preferred_contact: '',
  comment: '',
});

export const initialCheckoutState = (): CheckoutState => ({
  personalizations: {},
  services: [],
  delivery: emptyDelivery(),
  contact: emptyContact(),
  payment_method: 'OFFLINE',
});
