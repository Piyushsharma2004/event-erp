import { NextResponse } from "next/server";

let events = [
  { id: "1", name: "Tech Conference", date: "2025-04-10", club: "Tech Club" },
  { id: "2", name: "Startup Fest", date: "2025-05-02", club: "Entrepreneurship Club" },
];

export async function GET() {
  return NextResponse.json(events);
}

export async function POST(request: Request) {
    const newEvent = await request.json();
    newEvent.id = Date.now().toString();
    events.push(newEvent);
    return NextResponse.json(newEvent);
  }
  