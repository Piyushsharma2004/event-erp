import { NextResponse } from "next/server";

// Comprehensive event data
const events = [
  {
    id: "1",
    name: "Tech Conference 2025",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovators.",
    date: "Apr 10, 2025",
    time: "9:00 AM - 5:00 PM",
    club: "Tech Club",
    category: "Academic",
    price: 500,
    location: "University Main Auditorium",
    image: "/tech.jpeg",
    registeredCount: 68,
    totalSpots: 100,
    highlights: [
      "Keynote speeches from industry leaders",
      "Hands-on workshops on emerging technologies",
      "Networking lunch with professionals",
      "Career opportunities with tech giants"
    ],
    speakers: [
      { name: "Dr. Sarah Johnson", role: "AI Research Director, TechCorp", image: null },
      { name: "Michael Chen", role: "CTO, InnovateTech", image: null },
      { name: "Prof. David Williams", role: "Computer Science Department Head", image: null }
    ]
  },
  {
    id: "2",
    name: "Startup Pitch Fest",
    description: "Witness innovative startup ideas and network with entrepreneurs and investors.",
    date: "May 2, 2025",
    time: "2:00 PM - 6:00 PM",
    club: "Entrepreneurship Club",
    category: "Career",
    price: 300,
    location: "Business School, Room 102",
    image: "/Startup.jpeg",
    registeredCount: 45,
    totalSpots: 75,
    highlights: [
      "Pitch your startup idea to a panel of investors",
      "Mentorship sessions with successful entrepreneurs",
      "Networking opportunities with potential investors",
      "Prize money for top 3 pitches"
    ],
    speakers: [
      { name: "Emma Roberts", role: "Angel Investor", image: null },
      { name: "Raj Patel", role: "Founder, SuccessStartups", image: null }
    ]
  },
  {
    id: "3",
    name: "AI Workshop",
    description: "Learn the basics of artificial intelligence and machine learning in this hands-on workshop.",
    date: "Jun 15, 2025",
    time: "10:00 AM - 3:00 PM",
    club: "AI Club",
    category: "Academic",
    price: 0,
    location: "Computer Science Building, Lab 3",
    image: "/ai.jpeg",
    registeredCount: 58,
    totalSpots: 60,
    highlights: [
      "Introduction to machine learning algorithms",
      "Hands-on practice with Python and TensorFlow",
      "Build your first AI model during the workshop",
      "Take-home projects and resources"
    ],
    speakers: [
      { name: "Dr. Alex Zhang", role: "AI Professor", image: null },
      { name: "Lisa Kumar", role: "ML Engineer, DataTech", image: null }
    ]
  },
  {
    id: "4",
    name: "Cultural Night",
    description: "Celebrate diversity with performances, food, and activities from around the world.",
    date: "Apr 22, 2025",
    time: "6:00 PM - 10:00 PM",
    club: "International Students Association",
    category: "Social",
    price: 200,
    location: "Student Center",
    image: "/Cultural.jpeg",
    registeredCount: 120,
    totalSpots: 200,
    highlights: [
      "Cultural performances from over 15 countries",
      "International food festival",
      "Traditional costume showcase",
      "Interactive cultural activities and games"
    ],
    speakers: []
  },
  {
    id: "5",
    name: "Basketball Tournament",
    description: "Inter-department basketball competition with exciting prizes for winners.",
    date: "May 10, 2025",
    time: "9:00 AM - 6:00 PM",
    club: "Sports Club",
    category: "Sports",
    price: 100,
    location: "University Sports Complex",
    image: "/Basketball.jpg",
    registeredCount: 80,
    totalSpots: 120,
    highlights: [
      "Teams from all university departments",
      "Professional referees and equipment",
      "Cash prizes for winning teams",
      "Free refreshments for participants"
    ],
    speakers: [
      { name: "Coach James Wilson", role: "University Basketball Coach", image: null }
    ]
  },
  {
    id: "6",
    name: "Art Exhibition",
    description: "Showcasing student artwork from various disciplines and mediums.",
    date: "Jun 5, 2025",
    time: "11:00 AM - 7:00 PM",
    club: "Fine Arts Society",
    category: "Arts",
    price: 0,
    location: "Art Gallery, Building C",
    image: "/Art.jpeg",
    registeredCount: 35,
    totalSpots: 150,
    highlights: [
      "Artwork from students across all years",
      "Various mediums including painting, sculpture, and digital art",
      "Meet and talk with the artists",
      "Selected pieces available for purchase"
    ],
    speakers: [
      { name: "Prof. Clara Martinez", role: "Head of Fine Arts Department", image: null }
    ]
  }
];

import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Get specific event
  if (params.id) {
    const event = events.find((e) => e.id === params.id);
    return event 
      ? NextResponse.json(event) 
      : NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  
  // Get all events (would be used on the events listing page)
  return NextResponse.json(events);
}