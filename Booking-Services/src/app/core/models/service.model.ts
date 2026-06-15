export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt?: string;
}

export interface ServiceRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive?: boolean;
}
