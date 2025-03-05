import axios from 'axios';
import { Person } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export const getCustomers = async (): Promise<Person[]> => {
  const response = await axios.get(`${API_URL}/customers`);
  return response.data;
};

export const createCustomer = async (customer: Omit<Person, 'id'>): Promise<Person> => {
  const response = await axios.post(`${API_URL}/customers`, customer);
  return response.data;
};

export const updateCustomer = async (id: string, customer: Omit<Person, 'id'>): Promise<Person> => {
  const response = await axios.put(`${API_URL}/customers/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/customers/${id}`);
};