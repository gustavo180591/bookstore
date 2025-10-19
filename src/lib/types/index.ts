export interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other user properties as needed
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pendiente' | 'Procesando' | 'En camino' | 'Entregado' | 'Cancelado';
  items: number;
}
