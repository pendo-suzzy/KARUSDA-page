// Centralized seed data. The AppContext loads this on first run, then
// persists every edit to localStorage so admin changes survive a refresh.

export const initialData = {
  announcements: [
    {
      id: "a1",
      title: "Communion Sabbath this week",
      body: "Join us this Sabbath as we observe the Ordinance of Humility and Communion during the second service. Please come prepared in heart.",
      date: "2026-06-27",
      likes: 24,
    },
    {
      id: "a2",
      title: "Choir robes fitting — Sunday",
      body: "All 60+ KARUSDA Voices members should report to the main auditorium this Sunday at 1:30 PM, before practice, for robe fitting ahead of camp meeting.",
      date: "2026-06-25",
      likes: 11,
    },
    {
      id: "a3",
      title: "Mission pledge drive closes Friday",
      body: "We are 68% to our goal for the Mt. Kenya Border Outreach. If you have pledged but not yet contributed, the drive closes this Friday before vespers.",
      date: "2026-06-22",
      likes: 37,
    },
  ],

  events: {
    services: [
      {
        id: "s1",
        title: "Sabbath Worship Service",
        date: "Every Saturday",
        time: "7:00 AM – 5:00 PM",
        location: "Main Sanctuary, Karatina University",
        description:
          "Sabbath School, Divine Service, and afternoon fellowship — a full day set apart for rest and worship.",
      },
    ],
    gatherings: [
      {
        id: "g1",
        title: "AMO & ALO Fellowship",
        date: "Every Tuesday",
        time: "5:30 PM",
        location: "Chapel Annex",
        description: "Joint fellowship for the Adventist Men's and Ladies' Organizations.",
      },
      {
        id: "g2",
        title: "Wednesday Vespers",
        date: "Every Wednesday",
        time: "5:30 PM",
        location: "Main Sanctuary",
        description: "A short, quiet midweek service to recenter before the second half of the week.",
      },
      {
        id: "g3",
        title: "Friday Vespers",
        date: "Every Friday",
        time: "5:00 PM",
        location: "Main Sanctuary",
        description: "Welcoming the Sabbath in song and prayer as the sun goes down.",
        isSabbathEve: true,
      },
    ],
    volunteer: [
      {
        id: "v1",
        title: "Welcome Team — Sabbath Ushering",
        date: "Ongoing, every Sabbath",
        time: "6:30 AM call time",
        location: "Main Entrance",
        description: "Greet members and visitors, guide seating, and assist with offering collection.",
      },
      {
        id: "v2",
        title: "Campus Outreach Distribution",
        date: "First Saturday afternoons",
        time: "2:30 PM – 4:30 PM",
        location: "University hostels",
        description: "Hand-deliver literature and care packages to students across campus halls.",
      },
    ],
  },

  gallery: [
    { id: "p1", src: "https://picsum.photos/seed/karusda1/600/600", caption: "Border outreach, Mt. Kenya region" },
    { id: "p2", src: "https://picsum.photos/seed/karusda2/600/600", caption: "Sabbath School, Cradle Roll class" },
    { id: "p3", src: "https://picsum.photos/seed/karusda3/600/600", caption: "KARUSDA Voices at camp meeting" },
    { id: "p4", src: "https://picsum.photos/seed/karusda4/600/600", caption: "Friday vespers, sunset over campus" },
    { id: "p5", src: "https://picsum.photos/seed/karusda5/600/600", caption: "Youth literature evangelism" },
    { id: "p6", src: "https://picsum.photos/seed/karusda6/600/600", caption: "Communion Sabbath" },
    { id: "p7", src: "https://picsum.photos/seed/karusda7/600/600", caption: "Baptism at the river" },
    { id: "p8", src: "https://picsum.photos/seed/karusda8/600/600", caption: "Volunteer team, hostel distribution" },
  ],

  ministries: [
    {
      id: "m1",
      name: "The Millerites",
      tagline: "Watching for the dawn",
      description:
        "Named for the early Adventist pioneers who searched the prophecies, the Millerites ministry is devoted to Bible prophecy study and personal evangelism training.",
      meetingDay: "Monday",
      meetingTime: "5:30 PM",
    },
    {
      id: "m2",
      name: "The Whites",
      tagline: "Writing the testimony",
      description:
        "Carrying the name of Ellen and James White, this ministry focuses on writing, publishing, and the Spirit of Prophecy — producing the church bulletin and devotional materials.",
      meetingDay: "Monday",
      meetingTime: "5:30 PM",
    },
    {
      id: "m3",
      name: "The Waldensers",
      tagline: "Keeping faith in hidden places",
      description:
        "Inspired by the Waldensian believers who preserved scripture through centuries of hardship, this ministry leads small-group Bible study cells across student hostels.",
      meetingDay: "Monday",
      meetingTime: "5:30 PM",
    },
  ],

  choir: {
    name: "KARUSDA Voices",
    members: 62,
    leadName: "Bro. Daniel Mwangi",
    practiceTimes: [
      { day: "Sunday", time: "2:00 PM" },
      { day: "Thursday", time: "5:00 PM" },
    ],
    description:
      "Sixty-plus vocalists leading worship in four-part harmony every Sabbath and at special programs across the year.",
  },

  leadership: [
    { id: "l1", name: "Elder James Karanja", role: "Head Elder", bio: "Serving KARUSDA's eldership for 6 years." },
    { id: "l2", name: "Sis. Mercy Wanjiru", role: "Deaconess Coordinator", bio: "Oversees hospitality and welfare." },
    { id: "l3", name: "Bro. Peter Njoroge", role: "Youth Director", bio: "Leads campus evangelism and AY programs." },
  ],

  missions: {
    past: [
      {
        id: "mp1",
        title: "Mt. Kenya Forest-Edge Outreach",
        year: "2025",
        summary: "Three-day literature and medical outreach to forest-edge villages; 14 baptisms recorded.",
      },
      {
        id: "mp2",
        title: "Karatina Town Market Evangelism",
        year: "2024",
        summary: "Weekend campaign reaching market traders with health talks and Bible studies.",
      },
      {
        id: "mp3",
        title: "Nyeri County Schools Outreach",
        year: "2023",
        summary: "Partnered with three secondary schools for character-building seminars and Bible weeks.",
      },
    ],
    upcoming: [
      {
        id: "mu1",
        title: "Mt. Kenya Border Outreach",
        year: "2026",
        summary: "A return visit to the forest-edge communities, expanding into a full medical camp.",
        goalKes: 350000,
        raisedKes: 238000,
      },
      {
        id: "mu2",
        title: "Inter-University Bible Conference Sponsorship",
        year: "2027",
        summary: "Sponsoring student delegates from KARUSDA to the regional inter-university conference.",
        goalKes: 150000,
        raisedKes: 42000,
      },
    ],
  },

  stats: {
    yearsActive: 12,
    members: 600,
    ministries: 3,
    choirVoices: 62,
  },

  contact: {
    address: "Karatina University, Karatina, Kenya",
    phone: "+254 700 000 000",
    email: "karusda@karu.ac.ke",
    facebook: "facebook.com/karusda",
    instagram: "instagram.com/karusda",
  },
};

// NOTE: demo credentials only — replace with real auth before production use.
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "karusda2026",
};
