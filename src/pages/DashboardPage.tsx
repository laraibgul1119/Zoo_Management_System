import React, { useState } from 'react';
import { Ticket, Calendar, BarChart3, Users, ArrowLeft, TrendingUp, Clock } from 'lucide-react';
import { TicketsPage } from './TicketsPage';
import { EventsPage } from './EventsPage';

interface DashboardPageProps {
  onBack: () => void;
}

export function DashboardPage({ onBack }: DashboardPageProps) {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'tickets' | 'events'>('dashboard');

  if (currentPage === 'tickets') {
    return <TicketsPage onBack={() => setCurrentPage('dashboard')} />;
  }

  if (currentPage === 'events') {
    return <EventsPage onBack={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="bg-gray-200 p-2 border-2 border-black hover:bg-gray-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-xl font-black text-white">Z</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase">ZooKeeper Dashboard</h1>
                  <p className="text-gray-600 font-medium">Manage tickets, events, and visitor experiences</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-500">Today</div>
              <div className="text-lg font-black">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-black">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div className="bg-[#10B981] px-2 py-1 border-2 border-black">
                <span className="text-xs font-black text-black">+12%</span>
              </div>
            </div>
            <div className="text-3xl font-black text-black mb-1">1,247</div>
            <div className="text-sm font-bold text-gray-600">Tickets Sold Today</div>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center border-2 border-black">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="bg-[#FBBF24] px-2 py-1 border-2 border-black">
                <span className="text-xs font-black text-black">5 TODAY</span>
              </div>
            </div>
            <div className="text-3xl font-black text-black mb-1">23</div>
            <div className="text-sm font-bold text-gray-600">Active Events</div>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-black">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="bg-[#2563EB] px-2 py-1 border-2 border-black">
                <span className="text-xs font-black text-white">LIVE</span>
              </div>
            </div>
            <div className="text-3xl font-black text-black mb-1">892</div>
            <div className="text-sm font-bold text-gray-600">Current Visitors</div>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8B5CF6] rounded-full flex items-center justify-center border-2 border-black">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="bg-[#10B981] px-2 py-1 border-2 border-black">
                <span className="text-xs font-black text-black">+8%</span>
              </div>
            </div>
            <div className="text-3xl font-black text-black mb-1">$31,240</div>
            <div className="text-sm font-bold text-gray-600">Revenue Today</div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tickets Management */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-black">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">Ticket Management</h2>
                <p className="text-gray-600 font-medium">Create and manage admission tickets</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <span className="font-bold">Adult Tickets</span>
                <span className="font-black text-[#2563EB]">$25.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <span className="font-bold">Child Tickets (10% off)</span>
                <span className="font-black text-[#10B981]">$22.50</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <span className="font-bold">Senior Tickets (15% off)</span>
                <span className="font-black text-[#F97316]">$21.25</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('tickets')}
              className="w-full bg-[#2563EB] text-white py-4 font-black border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              MANAGE TICKETS
            </button>
          </div>

          {/* Events Management */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center border-2 border-black">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">Event Management</h2>
                <p className="text-gray-600 font-medium">Schedule shows and activities</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <div>
                  <div className="font-bold">Lion Feeding Show</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2:00 PM - 2:30 PM
                  </div>
                </div>
                <div className="bg-[#10B981] px-2 py-1 border-2 border-black">
                  <span className="text-xs font-black text-black">TODAY</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <div>
                  <div className="font-bold">Penguin Talk</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    11:00 AM - 11:45 AM
                  </div>
                </div>
                <div className="bg-[#FBBF24] px-2 py-1 border-2 border-black">
                  <span className="text-xs font-black text-black">TODAY</span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                <div>
                  <div className="font-bold">Elephant Bath Time</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    4:00 PM - 4:30 PM
                  </div>
                </div>
                <div className="bg-[#2563EB] px-2 py-1 border-2 border-black">
                  <span className="text-xs font-black text-white">TODAY</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('events')}
              className="w-full bg-[#F97316] text-white py-4 font-black border-2 border-black hover:bg-[#EA580C] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              MANAGE EVENTS
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentPage('tickets')}
              className="bg-[#10B981] text-black p-4 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-3"
            >
              <Ticket className="w-5 h-5" />
              CREATE NEW TICKET
            </button>
            <button
              onClick={() => setCurrentPage('events')}
              className="bg-[#FBBF24] text-black p-4 font-black border-2 border-black hover:bg-[#F59E0B] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-3"
            >
              <Calendar className="w-5 h-5" />
              SCHEDULE EVENT
            </button>
            <button
              onClick={() => alert('Visitor analytics coming soon!')}
              className="bg-[#8B5CF6] text-white p-4 font-black border-2 border-black hover:bg-[#7C3AED] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              VIEW ANALYTICS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}