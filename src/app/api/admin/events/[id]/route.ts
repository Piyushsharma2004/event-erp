import { NextRequest, NextResponse } from "next/server";

interface Event {
  id: string;
  // Define other properties of the event if needed
}

let events: Event[] = [
  { id: "1" }, // Example events
  { id: "2" },
];

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("id"); // Extract `id` from the request URL

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  events = events.filter((event) => event.id !== eventId);

  return NextResponse.json({ message: "Event deleted" });
}
