import api from './api';

export interface ClinicSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    [key: string]: string;
  };
}

export const settingsService = {
  async getSettings(): Promise<ClinicSettings> {
    try {
      const response = await api.get('/settings');
      return response.data.data || {};
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return default settings if API call fails
      return {
        name: '',
        address: '',
        phone: '',
        email: '',
        workingHours: {
          monday: '09:00 - 17:00',
          tuesday: '09:00 - 17:00',
          wednesday: '09:00 - 17:00',
          thursday: '09:00 - 17:00',
          friday: '09:00 - 17:00',
          saturday: '09:00 - 13:00',
          sunday: 'Closed'
        }
      };
    }
  },

  async saveSettings(settings: ClinicSettings): Promise<ClinicSettings> {
    try {
      // First try to get existing settings
      const existingSettings = await this.getSettings();
      
      if (existingSettings && existingSettings.name) {
        // If settings exist, update them
        const response = await api.put('/settings', settings);
        return response.data.data;
      } else {
        // If no settings exist, create new ones
        const response = await api.post('/settings', settings);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async updateSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings> {
    const response = await api.put('/settings', settings);
    return response.data.data;
  }
}; 