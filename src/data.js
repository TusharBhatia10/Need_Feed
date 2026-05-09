export const initials = (n) => n.split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase();

export const HOMES = [
  {
    id: "shanti", name: "Shanti Niketan Home", area: "Andheri West",
    address: "Plot 14, Veera Desai Road, Andheri West, Mumbai 400053",
    distance: 1.8, residents: 42, urgency: "urgent",
    contact: "Mrs. Anuradha Pillai", phone: "+91 98201 44872", email: "shanti.niketan@needfeed.in",
    hours: "Mon–Sat, 9:30 AM – 5:30 PM",
    about: "Shanti Niketan has been a refuge for elderly women in West Mumbai since 1987. We house 42 residents — most of whom have outlived their families — and provide daily meals, basic medical care, and a quiet, dignified community.",
    avatarTone: "teal",
    needs: [
      { item: "Atta (whole wheat flour)", category: "Grains", needed: 60, pledged: 25, unit: "kg" },
      { item: "Basmati Rice", category: "Grains", needed: 50, pledged: 50, unit: "kg" },
      { item: "Toor Dal", category: "Grains", needed: 30, pledged: 8, unit: "kg" },
      { item: "Mustard Oil", category: "Grains", needed: 20, pledged: 0, unit: "L" },
      { item: "Bath Soap", category: "Toiletries", needed: 50, pledged: 32, unit: "pieces" },
      { item: "Toothpaste (200g)", category: "Toiletries", needed: 25, pledged: 0, unit: "pieces" },
      { item: "Potatoes", category: "Vegetables", needed: 40, pledged: 12, unit: "kg" },
      { item: "Onions", category: "Vegetables", needed: 35, pledged: 35, unit: "kg" },
    ],
    topNeeds: ["Mustard Oil", "Toothpaste", "Toor Dal"],
  },
  {
    id: "sneh", name: "Sneh Old Age Home", area: "Malad East",
    address: "B-12, Pushpa Park, Malad East, Mumbai 400097",
    distance: 4.2, residents: 28, urgency: "moderate",
    contact: "Mr. Joseph D'Souza", phone: "+91 98330 12203", email: "sneh.malad@needfeed.in",
    hours: "All days, 10 AM – 6 PM",
    about: "A small home run by the D'Souza family for 22 years. Mostly couples and individuals from the local Catholic community.",
    avatarTone: "amber",
    topNeeds: ["Tea Powder", "Sugar", "Soap"],
  },
  {
    id: "asha", name: "Asha Bhavan", area: "Bandra East",
    address: "Sherly Rajan Road, Bandra East, Mumbai 400051",
    distance: 3.1, residents: 56, urgency: "urgent",
    contact: "Sister Mary Thomas", phone: "+91 98198 88712", email: "asha@needfeed.in",
    hours: "Mon–Sun, 8 AM – 7 PM",
    about: "Asha Bhavan supports 56 elderly residents, including 12 with mobility needs.",
    avatarTone: "coral",
    topNeeds: ["Adult Diapers", "Rice", "Cooking Oil"],
  },
  {
    id: "vanaprastha", name: "Vanaprastha Ashram", area: "Dadar West",
    address: "Lady Jamshedji Road, Dadar West, Mumbai 400028",
    distance: 6.4, residents: 35, urgency: "covered",
    contact: "Mr. Suresh Kulkarni", phone: "+91 98677 33910", email: "vanaprastha@needfeed.in",
    hours: "All days, 9 AM – 6 PM",
    about: "A vegetarian-only home for retired professionals and educators.",
    avatarTone: "green",
    topNeeds: ["Fruits", "Milk Powder", "Tea"],
  },
  {
    id: "matruchhaya", name: "Matruchhaya Care Home", area: "Borivali West",
    address: "L.T. Road, Borivali West, Mumbai 400092",
    distance: 9.8, residents: 48, urgency: "moderate",
    contact: "Dr. Smita Joshi", phone: "+91 98920 56781", email: "matruchhaya@needfeed.in",
    hours: "Mon–Sat, 10 AM – 5 PM",
    about: "Combined care home and day-clinic for ageing residents.",
    avatarTone: "teal",
    topNeeds: ["Atta", "Pulses", "Toiletries"],
  },
  {
    id: "saanjh", name: "Saanjh Senior Living", area: "Chembur",
    address: "Acharya Atre Marg, Chembur, Mumbai 400071",
    distance: 11.2, residents: 31, urgency: "urgent",
    contact: "Ms. Neha Shroff", phone: "+91 98215 90011", email: "saanjh@needfeed.in",
    hours: "All days, 8 AM – 8 PM",
    about: "A community-supported home with an active volunteer roster.",
    avatarTone: "ink",
    topNeeds: ["Rice", "Sugar", "Bedsheets"],
  },
];

export const RECENT_DONORS = [
  { name: "Priya Mehta", tone: "teal" },
  { name: "Rahul Sharma", tone: "coral" },
  { name: "Aditi Kulkarni", tone: "amber" },
  { name: "Vikram Iyer", tone: "green" },
  { name: "Anjali Rao", tone: "ink" },
];

export const DONOR_PLEDGES = [
  { id: 1, home: "Shanti Niketan Home", item: "Atta", qty: "10 kg", pledgeDate: "May 4, 2026", dropDate: "May 11, 2026", status: "Pledged" },
  { id: 2, home: "Asha Bhavan", item: "Cooking Oil", qty: "5 L", pledgeDate: "Apr 28, 2026", dropDate: "May 2, 2026", status: "Delivered" },
  { id: 3, home: "Sneh Old Age Home", item: "Soap", qty: "30 pcs", pledgeDate: "Apr 22, 2026", dropDate: "Apr 26, 2026", status: "Confirmed" },
  { id: 4, home: "Matruchhaya Care Home", item: "Toor Dal", qty: "8 kg", pledgeDate: "Apr 14, 2026", dropDate: "Apr 18, 2026", status: "Confirmed" },
  { id: 5, home: "Saanjh Senior Living", item: "Rice", qty: "20 kg", pledgeDate: "Apr 5, 2026", dropDate: "Apr 8, 2026", status: "Confirmed" },
  { id: 6, home: "Vanaprastha Ashram", item: "Milk Powder", qty: "4 kg", pledgeDate: "Mar 28, 2026", dropDate: "Mar 31, 2026", status: "Missed" },
];

export const INCOMING_PLEDGES = [
  { id: 1, donor: "Tushar Khanna", item: "Atta", qty: "10 kg", pledgeDate: "May 4", dropDate: "May 11, 2026", when: "upcoming", status: "Pledged" },
  { id: 2, donor: "Priya Mehta", item: "Toor Dal", qty: "8 kg", pledgeDate: "May 5", dropDate: "May 9, 2026", when: "today", status: "Pledged" },
  { id: 3, donor: "Rahul Sharma", item: "Mustard Oil", qty: "10 L", pledgeDate: "May 1", dropDate: "May 9, 2026", when: "today", status: "Pledged" },
  { id: 4, donor: "Aditi Kulkarni", item: "Potatoes", qty: "12 kg", pledgeDate: "May 6", dropDate: "May 13, 2026", when: "upcoming", status: "Pledged" },
  { id: 5, donor: "Vikram Iyer", item: "Bath Soap", qty: "20 pcs", pledgeDate: "Apr 25", dropDate: "May 5, 2026", when: "overdue", status: "Overdue" },
  { id: 6, donor: "Anjali Rao", item: "Toothpaste", qty: "15 pcs", pledgeDate: "May 2", dropDate: "May 14, 2026", when: "upcoming", status: "Pledged" },
];

export const HISTORY = [
  { donor: "Meera Joshi", item: "Basmati Rice", qty: "25 kg", date: "Apr 30, 2026", confirmedBy: "Anuradha P." },
  { donor: "Karthik Subramaniam", item: "Onions", qty: "20 kg", date: "Apr 28, 2026", confirmedBy: "Anuradha P." },
  { donor: "Priya Mehta", item: "Atta", qty: "15 kg", date: "Apr 24, 2026", confirmedBy: "Anuradha P." },
  { donor: "Rahul Sharma", item: "Bath Soap", qty: "30 pcs", date: "Apr 22, 2026", confirmedBy: "Anuradha P." },
  { donor: "Vikram Iyer", item: "Toor Dal", qty: "12 kg", date: "Apr 18, 2026", confirmedBy: "Sunil M." },
  { donor: "Aditi Kulkarni", item: "Potatoes", qty: "20 kg", date: "Apr 15, 2026", confirmedBy: "Anuradha P." },
  { donor: "Anjali Rao", item: "Mustard Oil", qty: "10 L", date: "Apr 11, 2026", confirmedBy: "Sunil M." },
  { donor: "Tushar Khanna", item: "Sugar", qty: "8 kg", date: "Apr 5, 2026", confirmedBy: "Anuradha P." },
];
