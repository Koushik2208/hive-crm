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
  email: string;
  phone: string;
  tags: string[];
  last_visit: string;
  notes: string;
  avatar_url?: string;
  status: "active" | "inactive";
}

export const clientsData: Client[] = [
  {
    id: "c_1",
    first_name: "Elena",
    last_name: "Vasquez",
    email: "elena.v@luxurymail.com",
    phone: "+1 (555) 012-3456",
    tags: ["VIP", "BALAYAGE"],
    last_visit: "Oct 20, 2023",
    notes: "Prefers lukewarm water during rinsing. Always requests the deep conditioning ritual...",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXFGJbPdKSDBdqggFS1_G8S2OipU_aYPRWacJGwHZS1vx5e4yIZZuEUfmBrkKOzu7f5PrNawlaUGgr1D6cTcoEQiKO0n9SGaoBlQzfQiTcvSMLxsZU3WJIr2-pcqT7LA6SsU0070ZBtGsY2aa_AuhnvnXrLzImvQohXrA98bctrPtrgsbreHyimcoj0_qFAtUIC-HldvGbmcJUcMz4r3DqOnU-lXLAbWeuW5apzqCW8gCMzOoyTX8pWH1kgyRVKal3yNF78AiEHI0",
    status: "active"
  },
  {
    id: "c_2",
    first_name: "Julian",
    last_name: "Thorne",
    email: "j.thorne@business.com",
    phone: "+1 (555) 987-6543",
    tags: ["REGULAR"],
    last_visit: "Oct 15, 2023",
    notes: "Classic tapered cut. Uses Aura Shine clay. Visits every 3 weeks exactly.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK1QAV8XxsaW22OWN5w8w8A4OmGMUHOUSzfqZKQgFkytyAE-P2nH3IKOsoeeiBponwKPiGoRQ90dTdL9Eqeoibw7kKXJQFAXW48atEcqQocBriOucfH3A_YMaGqxw2pwhdA_HSyUe8EVmMfFYEJ8ajgwO4bB8GrwIoksDWXoWToHNBJFEGQkgB-Wc8O8YXBH0u7_gpBsDIS8Bn4Yuh2ZUN32ySpWTt_Det0Bp_K6cmlgAkLyO3Ir6K2wR0zkRx3AQe1eFeq1eh9zY",
    status: "active"
  },
  {
    id: "c_3",
    first_name: "Sophia",
    last_name: "Ha",
    email: "sha.beauty@gmail.com",
    phone: "+1 (555) 234-5678",
    tags: ["NEW"],
    last_visit: "Oct 22, 2023",
    notes: "First appointment for wedding consultation. Looking for botanical hair treatments.",
    status: "active"
  },
  {
    id: "c_4",
    first_name: "Marcus",
    last_name: "Chen",
    email: "m.chen@arch.design",
    phone: "+1 (555) 345-6789",
    tags: ["VIP", "DIRECTOR"],
    last_visit: "Oct 12, 2023",
    notes: "Book for early mornings only. High sensitivity to synthetic fragrances.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHZp_vBA82wMld0XmDO8-znoAhw1FSwQv8qomNfYSJ6nAbu9TKib_U1Dp22vzfgkM7T7Nr99Z07ICnELssJu-kS6gMGwExpAZYB9kGIKNGvC2sEKQgNnnNSG0lKgZs1lUbKO4nYbuprp47c2XBO_m-YoBvQfeRIQPxvnqvq5_m5F85PGVQEP87zYo0PAl8AJRc98nOW72FvaE4v3T34aEwzQMLUnu_HBIe873pCedJPOPPSe-g3QGoaHA4tUEPGLHy0fbiMDQGJKM",
    status: "active"
  },
  {
    id: "c_5",
    first_name: "Zara",
    last_name: "Miller",
    email: "zara@creative.studio",
    phone: "+1 (555) 456-7890",
    tags: ["REGULAR"],
    last_visit: "Sep 28, 2023",
    notes: "Transitioning to platinum blonde. Requires 4-hour sessions.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZkwQ_DeBUVlrGJVd9d96ndR6QcSd81bLm3JnUryYjGssSH_EghwHisyitZ0CEnLkCnPcFKisVx_vK6oUsZfa7mCjlKe0KJcCz7I_FLs5gCvenbU7GaJAG0XkZYFX6ULGbJAZV3q_r2PVU4qmMR3G5X-CkIpGs93WGTJTYOHpvPX0bNPThwwmPPlnAlM_fTOXi_kEFJWwOEOcP51Z2558i1-dblCy_69y5rF-APl88jvpwIWS7FPqWK1XsI48QR6vV__IZGj4sT6g",
    status: "active"
  },
  {
    id: "c_6",
    first_name: "Arthur",
    last_name: "Penhaligon",
    email: "a.penhaligon@legacy.com",
    phone: "+1 (555) 567-8901",
    tags: ["VIP"],
    last_visit: "Oct 19, 2023",
    notes: "Executive grooming package. Prefers quiet environment, no background music during session.",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuALw7N7nbJr_snD4VaO-9omxchFPVxdfhnFLKu7bC3gCashuBrjjCuAP4evIIhpy8zfQ1p0UKxc2CQJZ3KvmeNPcjAB46K6AjpO3bZKBkN6z6GuX50DgYniAycyNT4Yojlvy_fOFan--CPBQ3aIsK-GhUFgbR5-efjY0ruUTd9B2jAbVpWJPlMvgMV6JDtkNkVJO5aAxJ8lV6n2zh1X30lLjNWx70ukwFLU94HTj2AKR0Lpe35Q-zEleaJBVcQldywCKQFXaJ_9W8g",
    status: "active"
  }
];

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
