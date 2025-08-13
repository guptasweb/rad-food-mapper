export type Truck = {
  objectid?: string;
  applicant?: string;
  status?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  distance_in_meters?: number;
};

export type Mode = 'applicant' | 'street' | 'nearest';

