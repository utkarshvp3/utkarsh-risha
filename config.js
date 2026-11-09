/*
 * ─────────────────────────────────────────────────────────────
 *  Wedding invitation — edit everything here.
 *  All times are IST (Asia/Kolkata). Use "YYYY-MM-DDTHH:MM".
 * ─────────────────────────────────────────────────────────────
 */
window.CONFIG = {
  groom: { name: 'Utkarsh', photo: 'assets/groom.webp' },
  bride: { name: 'Risha',   photo: 'assets/bride.webp' },

  // Main wedding muhurat — drives the Save-the-Date countdown.
  wedding: '2026-11-26T12:34',

  venue: {
    name: 'Nahata Lawns & Banquets',
    short: 'Nahata Lawns & Banquets, Pune',
    address: '29/1B, Sinhgad Rd, next to Vidya Sahakari Bank, near Veer Baji Pasalkar Chowk, Kirti Nagar, Vadgaon Budruk, Pune, Maharashtra 411041',
    mapUrl: 'https://maps.app.goo.gl/a6XLtug7DjC8wotv9',
    image: 'assets/wedding-vanue.webp',
  },

  // Each event gets a two-page spread in the flip calendar.
  // durationHours is used only for the "Add to Calendar" end time.
  events: [
    { name: 'Engagement', start: '2026-11-25T16:00', durationHours: 3, image: 'assets/wedding-reception.webp',
      note: 'Rings, blessings and the first promise of forever.' },
    { name: 'Sangeet',    start: '2026-11-25T20:00', durationHours: 2, image: 'assets/wedding-sangeet.webp',
      note: 'Music, dance and a night of celebration with family and friends.' },
    { name: 'Haldi',      start: '2026-11-25T22:00', durationHours: 2, image: 'assets/wedding-haldi.webp',
      note: 'Turmeric, marigolds and laughter — a golden blessing for the couple.' },
    { name: 'Saptapadi',  start: '2026-11-26T07:00', durationHours: 3, image: 'assets/wedding-custom.webp',
      note: 'Seven sacred steps around the holy fire — seven vows for a lifetime.' },
    { name: 'Wedding',    start: '2026-11-26T12:34', durationHours: 3, image: 'assets/wedding.webp',
      note: 'Shubh muhurat at 12:34 PM — join us as we begin our forever.', timeLabel: '12:34 PM · Muhurat' },
  ],

  // Photo memories (6 slots). Replace with your own photos.
  gallery: [
    'assets/gallery-1.webp', 'assets/gallery-2.webp', 'assets/gallery-3.webp',
    'assets/gallery-4.webp', 'assets/gallery-5.webp', 'assets/gallery-6.webp',
  ],

  // Optional background music. Put an .mp3 in assets/ and set e.g. 'assets/music.mp3'.
  // Leave empty ('') to hide the music button.
  music: '',
};
