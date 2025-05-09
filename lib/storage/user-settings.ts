import { UserSettings, UserSettingsSchema } from '@/schemas';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'ru'
};

class LocalSettingsStorage {
  private readonly STORAGE_KEY = 'user-settings';

  get(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return DEFAULT_SETTINGS;

      const parsed = JSON.parse(stored);
      return UserSettingsSchema.parse(parsed);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  set(settings: Partial<UserSettings>): void {
    if (typeof window === 'undefined') return;

    const current = this.get();
    const updated = { ...current, ...settings };

    try {
      UserSettingsSchema.parse(updated);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Invalid settings:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const localSettings = new LocalSettingsStorage();
