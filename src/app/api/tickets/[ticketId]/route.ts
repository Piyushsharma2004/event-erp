// Import any required dependencies (if needed)
// import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { ticketId: string } }) {
    try {
      // Get the ticketId from the URL params
      const ticketId = params.ticketId;
      
      // Sample events data - in production, this would likely come from a database
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
          image: "/tech.jpeg"
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
          image: "/Startup.jpeg"
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
          image: "/ai.jpeg"
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
          image: "/Cultural.jpeg"
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
          image: "/Basketball.jpg"
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
          image: "/Art.jpeg"
        }
      ];
  
      // Find the ticket/event with the matching ID
      const ticket = events.find(event => event.id === ticketId);
  
      // If no ticket is found, return a 404 response
      if (!ticket) {
        return new Response(JSON.stringify({ error: "Ticket not found" }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
  
      // Return the ticket data
      return new Response(JSON.stringify(ticket), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching ticket:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }