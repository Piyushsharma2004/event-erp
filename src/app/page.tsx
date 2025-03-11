"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Search, Users, Star, Bell, BookOpen, Award, Music, Cpu, Briefcase } from "lucide-react";
import useColorMode from "@/hook/useColorMode";

export default function HomePage() {
  const [colorMode] = useColorMode();
  type Event = {
    id: number;
    name: string;
    category: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState([
    { id: 1, name: "Academic", count: 24, icon: <BookOpen className="w-5 h-5" /> },
    { id: 2, name: "Cultural", count: 18, icon: <Music className="w-5 h-5" /> },
    { id: 3, name: "Sports", count: 15, icon: <Award className="w-5 h-5" /> },
    { id: 4, name: "Technical", count: 12, icon: <Cpu className="w-5 h-5" /> },
    { id: 5, name: "Placement", count: 10, icon: <Briefcase className="w-5 h-5" /> },
  ]);
  
  // Festivals data for cultural events
  const [festivals, setFestivals] = useState([
    { id: 1, name: "Diwali Celebration", date: "Nov 12, 2025", description: "Join the festival of lights with rangoli competition and cultural performances" },
    { id: 2, name: "Holi Fest", date: "Mar 25, 2026", description: "Celebrate the colorful festival with organic colors and traditional music" },
    { id: 3, name: "Garba Night", date: "Oct 15, 2025", description: "Experience traditional Gujarati dance during Navratri celebrations" }
  ]);
  
  useEffect(() => {
    // Sample events data for JECRC University
    const jecrcEvents = [
      {
        id: 1,
        name: "Rhythm 2025",
        category: "Cultural",
        date: "Apr 5, 2025",
        time: "10:00 AM",
        location: "Main Campus Auditorium",
        description: "JECRC&apos;s annual cultural fest with performances, competitions, and celebrity appearances.",
        image: "/cultural.jpeg"
      },
      {
        id: 2,
        name: "Hackathon 3.0",
        category: "Technical",
        date: "May 12, 2025",
        time: "9:00 AM",
        location: "CS Department",
        description: "24-hour coding competition with industry mentors and exciting prizes.",
        image: "/hackathon.jpg"
      },
      {
        id: 3,
        name: "Placement Drive: Infosys",
        category: "Placement",
        date: "Mar 20, 2025",
        time: "11:00 AM",
        location: "Placement Cell",
        description: "Campus recruitment drive for final year students across all departments.",
        image: "/Placement.jpg"
      }
    ];
    
    setEvents(jecrcEvents);
  }, []);
  
  return (
    
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Hero Section - Enhanced with search bar and JECRC branding */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-orange-600 via-amber-500 to-green-500 text-white">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Image
            src="/event.jpeg"
            alt="JECRC University Events"
            width={1200}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="relative text-center max-w-4xl px-6 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white dark:text-white">
            JECRC University Events Portal
          </h1>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Discover vibrant campus life with cultural fests, technical workshops, and academic seminars
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="flex bg-white/10 backdrop-blur-md p-2 rounded-xl">
              <input 
                type="text" 
                placeholder="Search for events..." 
                className="w-full bg-transparent border-none text-white placeholder-white/70 focus:outline-none px-4"
              />
              <button className="bg-white text-orange-600 px-5 py-2 rounded-lg font-medium hover:bg-orange-100 transition">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/events">
              <button className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg shadow-lg hover:bg-orange-100 transition flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Browse Events
              </button>
            </Link>
            <Link href="/clubs">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition flex items-center gap-2">
                <Users className="w-5 h-5" />
                Explore Clubs
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats - New Section */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center py-4">
              <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Annual Events</p>
            </div>
            <div className="text-center py-4">
              <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">30+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Clubs</p>
            </div>
            <div className="text-center py-4">
              <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">12,000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Students</p>
            </div>
            <div className="text-center py-4">
              <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400">5+</h3>
              <p className="text-gray-600 dark:text-gray-300">Major Festivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 dark:text-white">Browse by Category</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect events that match your interests and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 text-center hover:shadow-lg hover:scale-105 transition cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold dark:text-white">{category.name}</h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium">{category.count} events</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events - Enhanced with images */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Don not miss out on these popular events</p>
          </div>
          <Link href="/events">
            <span className="text-orange-600 dark:text-orange-400 font-medium hover:underline">View all →</span>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <Image
                  src={event.image || "/api/placeholder/400/320"}
                  alt={event.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-orange-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {event.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-orange-600 dark:group-hover:text-orange-400 transition dark:text-white">{event.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-2 mt-4 text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <Link href={`/events/${event.id}`}>
                  <button className="mt-5 w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Festivals - New Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Traditional Festivals at JECRC</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
              Experience the rich cultural heritage of India through our campus celebrations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {festivals.map((festival) => (
              <div key={festival.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition border border-orange-100 dark:border-gray-700">
                <div className="h-40 bg-orange-400 dark:bg-orange-900/50 flex items-center justify-center text-white relative">
                  <div className="absolute inset-0 opacity-20 bg-pattern-diwali"></div>
                  <h3 className="text-2xl font-bold relative z-10">{festival.name}</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{festival.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{festival.description}</p>
                  <Link href={`/festivals/${festival.id}`}>
                    <button className="mt-5 w-full border border-orange-600 text-orange-600 dark:text-orange-400 dark:border-orange-400 px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Clubs - Enhanced with images */}
      <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">Join Your Favorite Clubs</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
              Connect with like-minded individuals and participate in club activities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Abhivyakti", description: "Drama and theater club for aspiring actors and performers", members: 120, events: 8, icon: <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" /> },
              { name: "Fusion Music", description: "Blend Indian classical and western music in unique performances", members: 85, events: 5, icon: <Music className="w-6 h-6 text-orange-600 dark:text-orange-400" /> },
              { name: "Startup Studio", description: "JECRC&apos;s entrepreneurship club for budding founders and innovators", members: 95, events: 6, icon: <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" /> }
            ].map((club) => (
              <div key={club.name} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                    {club.icon}
                  </div>
                  <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" /> {club.members}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mt-4 dark:text-white">{club.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{club.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{club.events} upcoming events</span>
                  <Link href={`/clubs/${club.name.toLowerCase().replace(" ", "-")}`}>
                    <button className="text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium">
                      Learn more →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Map - New Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-white">Campus Event Venues</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Find your way around JECRC University&apos;s event spaces
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="relative h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <Image
              src="/campus-map-1.png"
              alt="JECRC University Campus Map"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-white text-center px-6 py-3 bg-orange-600 rounded-lg">
                Interactive campus map would appear here
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-400">Main Auditorium</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Capacity: 1,200 people</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-400">Open Air Theater</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Capacity: 2,000 people</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-400">Conference Center</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Capacity: 500 people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced with Indian names */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold dark:text-white">What Students Say</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Hear from students who have attended our events and joined our community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Rahul Sharma",
              role: "Computer Science, Year 3",
              quote: "The Tech Week hackathon was one of the best experiences of my university life. I met amazing people and learned so much!"
            },
            {
              name: "Priya Patel",
              role: "Business Admin, Year 2",
              quote: "Renaissance cultural fest gave me the perfect platform to showcase my talent. Performing on stage was a dream come true!"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">{testimonial.quote}</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="mt-3 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss upcoming events and announcements
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-100 transition"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm mt-3 text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-16 bg-orange-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold">Don not Miss Out!</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Book your tickets now and experience the best JECRC University events. Early birds get special discounts!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/events">
              <button className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg shadow-lg hover:bg-orange-100 transition">
                Explore Events
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">JECRC University</h3>
              <p className="text-gray-400">
                Plot No. IS-2036 to IS-2039, Ramchandrapura, Sitapura Industrial Area Extension, Jaipur, Rajasthan 303905
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/events" className="hover:text-white transition">Events</Link></li>
                <li><Link href="/clubs" className="hover:text-white transition">Clubs</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.id}`} className="hover:text-white transition">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400 mb-2">
                Email: events@jecrcuniversity.edu.in
              </p>
              <p className="text-gray-400">
                Phone: +91 98765 43210
              </p>
              <div className="flex gap-4 mt-4">
                {/* Social icons */}
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                  {/* Twitter/X icon */}
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                  {/* Instagram icon */}
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                  {/* Facebook icon */}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} JECRC University Events Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}