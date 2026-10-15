/**
 * WhatsApp Contact Integration Configuration
 * Single source of truth for Ventura WhatsApp integration
 */

export const WHATSAPP_CONFIG = {
  phoneNumber: '+92 300 966 7001',
  rawNumber: '923009667001',
  baseUrl: 'https://wa.me/923009667001',
  prefilledMessage: 'Hi! I visited your Ventura portfolio and would like to connect with you.',
  get directUrl(): string {
    const encoded = encodeURIComponent(this.prefilledMessage);
    return `${this.baseUrl}?text=${encoded}`;
  }
};
