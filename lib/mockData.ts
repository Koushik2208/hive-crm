export type AppointmentStatus = "booked" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";

export interface Staff {
  id: string;
  name: string;
  avatar_url?: string;
  color_hex: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Service {
  id: string;
  name: string;
  duration_mins: number;
}

export interface Appointment {
  id: string;
  starts_at: string; // ISO String mapping to today for easy rendering
  ends_at: string;
  status: AppointmentStatus | string;
  client: Client;
  service: Service;
  staff: Staff;
}

// Generate today's date for accurate positioning in the UI
const getTodayAtTime = (hours: number, minutes: number = 0) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const staffList: Staff[] = [
  {
    id: "s_1",
    name: "Sarah T.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6sSBV2-I4ug-6eFdgct26QwqfYaO05xqX0SwqIWzidK-ttLlrR0PbdCxPHpE7umh6S8JHbNeSbRCk7TA2XvTdBbg4_RT7cU2qGKRch5s8I8fkdv4oNn_7Q4-FoFC2O69416pKsqCb83H10F21bHaJWE4-7PZgip9NjAZ9H9W-XrHmDaTglc4TXhniVaw3sOlwpIaUmZTYAChJ-pemuDCLYSQPp9bHwIB9nRG4FZbHi33qZf_9PWDxjHYN-1gR4jp_BKm_xashAhE",
    color_hex: "#6c538b", // secondary
  },
  {
    id: "s_2",
    name: "Marcus L.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTMdS_EztN3FvFFIWz4BsgAZmjRxQP20HFMhOW1xwN0CzluwnbmeidH_VoAyk6amGO6omrZExpco9hJTPhJ5PAPwJNgI-Z_02I5DDPYwMpEeMTKXKPboPndJaJqEf-43Z61naQJIXaPIM4ToadvrFB-44wgJrSzRx1kZj49eFmFNXU84xw6wLk8fZ5uEfWZX-GorWxxGntIyB5j_vbVHqc-S7DcFREz8JqAb67oSQ3BQGI1vd77JZkdvkNiRS4Wi6B4KPCM4WCr64",
    color_hex: "#281f0a", // tertiary
  },
  {
    id: "s_3",
    name: "Elena V.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgGRm4zyw1D10085aXrTfRRPt0vCE6gNEylT1nQ_TSmfTuGuma6pM6qPutekHwPDr56BmyCkSQG8KbrWygdD_Y0uGKEW907zxQaBh_fJTIFiO29F6zJOEYenDPQbMR_RYEroSFm5DEt5hca7_9NnamXDz42d6HZdswkSrdpyGaFYaZoIgdcfcokm8vPfckfqTYTH4IqVt_IM1sdvCmseLeyN4dyK4SBBUcnsiVmMzTJ3qS97r9vrjaAdyG4XvcDrk_WkMIwf-pb2I",
    color_hex: "#32172a", // primary
  },
];

export const appointmentsData: Appointment[] = [
  {
    id: "apt_1",
    starts_at: getTodayAtTime(9, 30),
    ends_at: getTodayAtTime(10, 30),
    status: "confirmed",
    client: { id: "c_1", first_name: "Sophie", last_name: "Laurent" },
    service: { id: "srv_1", name: "Full Body Massage", duration_mins: 60 },
    staff: staffList[2], // Elena V.
  },
  {
    id: "apt_2",
    starts_at: getTodayAtTime(11, 0),
    ends_at: getTodayAtTime(12, 30),
    status: "in_progress",
    client: { id: "c_2", first_name: "Julianne", last_name: "Moretti" },
    service: { id: "srv_2", name: "Hydrafacial Deluxe", duration_mins: 90 },
    staff: staffList[0], // Sarah T.
  },
  {
    id: "apt_3",
    starts_at: getTodayAtTime(14, 15),
    ends_at: getTodayAtTime(15, 0),
    status: "booked", // We map "arriving" to a core booked status per schema limits
    client: { id: "c_3", first_name: "Arthur", last_name: "P." },
    service: { id: "srv_3", name: "Grooming & Trim", duration_mins: 45 },
    staff: staffList[1], // Marcus L.
  },
  {
    id: "apt_4",
    starts_at: getTodayAtTime(16, 0),
    ends_at: getTodayAtTime(17, 30),
    status: "confirmed",
    client: { id: "c_4", first_name: "Isabella", last_name: "Chen" },
    service: { id: "srv_4", name: "Aromatherapy Session", duration_mins: 90 },
    staff: staffList[2], // Elena V.
  },
  {
    id: "apt_5_a",
    starts_at: getTodayAtTime(12, 30),
    ends_at: getTodayAtTime(14, 0),
    status: "confirmed",
    client: { id: "c_5", first_name: "Aman & Aisha", last_name: "Khan" },
    service: { id: "srv_5", name: "Couples Hot Stone Massage", duration_mins: 90 },
    staff: staffList[0], // Sarah T.
  },
  {
    id: "apt_5_b",
    starts_at: getTodayAtTime(12, 30),
    ends_at: getTodayAtTime(14, 0),
    status: "confirmed",
    client: { id: "c_5", first_name: "Aman & Aisha", last_name: "Khan" },
    service: { id: "srv_5", name: "Couples Hot Stone Massage", duration_mins: 90 },
    staff: staffList[1], // Marcus L.
  },
];
