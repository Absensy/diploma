import { useState, useEffect } from 'react';

interface ContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  instagram?: string;
  working_hours: string;
  created_at: string;
  updated_at: string;
}

export function useAdminContacts() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contact info');
      }
      const data = await response.json();
      setContactInfo(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке контактов');
      // Fallback to default values if API fails
      setContactInfo({
        id: 1,
        address: 'пр. Янки Купалы 22а, цокольный этаж',
        phone: '+375 (29) 708-21-11',
        email: 'info@granit-grodno.by',
        instagram: 'granit.grodno',
        working_hours: 'Пн-Пт: 9:00 - 18:00, Сб-Вс: 10:00 - 16:00',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (contactData: Partial<ContactInfo>) => {
    try {
      setSaving(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedContactInfo = {
        ...contactInfo,
        ...contactData,
        updated_at: new Date().toISOString()
      } as ContactInfo;

      setContactInfo(updatedContactInfo);
      localStorage.setItem('adminContactInfo', JSON.stringify(updatedContactInfo));

      return updatedContactInfo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении контактов');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    saving,
    error,
    fetchContactInfo,
    updateContactInfo,
  };
}
