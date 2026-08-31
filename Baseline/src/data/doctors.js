const doctors = [
  {
    id: 1,

    name: "Amal Fernando",

    gender: "Male",

    specialization: "General Physician",

    image:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",

    hospitals: [
      {
        name: "Nawaloka Hospital",

        location: "Colombo 02",

        sessions: [
          {
            date: "2026-06-28",
            time: "Morning",
            startTime: "08:00 AM",
            patients: 12,
            price: 2500
          },

          {
            date: "2026-06-28",
            time: "Evening",
            startTime: "04:00 PM",
            patients: 8,
            price: 3000
          }
        ]
      },

      {
        name: "Asiri Hospital",

        location: "Kandy",

        sessions: [
          {
            date: "2026-06-29",
            time: "Evening",
            startTime: "05:00 PM",
            patients: 15,
            price: 3000
          }
        ]
      }
    ]
  },

  {
    id: 2,

    name: "Nuwan Perera",

    gender: "Male",

    specialization: "Cardiologist",

    image:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",

    hospitals: [
      {
        name: "Asiri Hospital",

        location: "Colombo",

        sessions: [
          {
            date: "2026-06-30",
            time: "Morning",
            startTime: "09:00 AM",
            patients: 20,
            price: 4000
          }
        ]
      }
    ]
  }
];

export default doctors;