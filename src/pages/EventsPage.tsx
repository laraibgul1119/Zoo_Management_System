import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { Event, EventFormData } from '../types';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

interface EventsPageProps {
  onBack: () => void;
}

export function EventsPage({ onBack }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([
    {
      eventId: 'E001',
      eventName: 'Lion Feeding Show',
      description: 'Watch our majestic lions during their daily feeding time. Learn about their diet and hunting behaviors.',
      startTime: '2024-12-27T14:00',
      endTime: '2024-12-27T14:30',
      location: 'Lion Habitat',
      maxCapacity: 50
    },
    {
      eventId: 'E002',
      eventName: 'Penguin Talk',
      description: 'Educational presentation about penguin species, their habitat, and conservation efforts.',
      startTime: '2024-12-27T11:00',
      endTime: '2024-12-27T11:45',
      location: 'Penguin Enclosure',
      maxCapacity: 30
    },
    {
      eventId: 'E003',
      eventName: 'Elephant Bath Time',
      description: 'Join us as our elephants enjoy their daily bath and enrichment activities.',
      startTime: '2024-12-27T16:00',
      endTime: '2024-12-27T16:30',
      location: 'Elephant Pool',
      maxCapacity: 75
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    maxCapacity: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      eventName: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      maxCapacity: ''
    });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      maxCapacity: event.maxCapacity.toString()
    });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.eventId !== eventId));
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName || !formData.startTime || !formData.endTime || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      setMessage({ type: 'error', text: 'End time must be after start time' });
      return;
    }

    const eventData: Event = {
      eventId: editingEvent ? editingEvent.eventId : `E${String(events.length + 1).padStart(3, '0')}`,
      eventName: formData.eventName,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      maxCapacity: parseInt(formData.maxCapacity) || 0
    };

    if (editingEvent) {
      setEvents(events.map(e => e.eventId === editingEvent.eventId ? eventData : e));
      setMessage({ type: 'success', text: 'Event updated successfully!' });
    } else {
      setEvents([...events, eventData]);
      setMessage({ type: 'success', text: 'Event created successfully!' });
    }

    setShowModal(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setMessage({ type: '', text: '' });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  const isEventToday = (startTime: string) => {
    const eventDate = new Date(startTime).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  };

  const isEventUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

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
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase">Event Management</h1>
                  <p className="text-gray-600 font-medium">Schedule and manage zoo events and shows</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddEvent}
              className="bg-[#10B981] text-black px-6 py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              ADD EVENT
            </button>
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {message.text}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.eventId} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FBBF24] px-3 py-1 border-2 border-black">
                    <span className="font-black text-sm">{event.eventId}</span>
                  </div>
                  {isEventToday(event.startTime) && (
                    <div className="bg-[#EF4444] text-white px-2 py-1 border-2 border-black text-xs font-black">
                      TODAY
                    </div>
                  )}
                  {isEventUpcoming(event.startTime) && !isEventToday(event.startTime) && (
                    <div className="bg-[#10B981] text-black px-2 py-1 border-2 border-black text-xs font-black">
                      UPCOMING
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="bg-[#2563EB] text-white p-2 border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.eventId)}
                    className="bg-[#EF4444] text-white p-2 border-2 border-black hover:bg-[#DC2626] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black mb-3 uppercase">{event.eventName}</h3>

              {event.description && (
                <p className="text-gray-600 font-medium mb-4 leading-relaxed">{event.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-bold">Date:</span>
                  <span className="font-medium">{formatDateTime(event.startTime)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                  <span className="font-bold">Time:</span>
                  <span className="font-medium">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </span>
                  <span className="bg-gray-200 px-2 py-1 border border-black text-xs font-bold">
                    {getDuration(event.startTime, event.endTime)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#10B981]" />
                  <span className="font-bold">Location:</span>
                  <span className="font-medium">{event.location}</span>
                </div>

                {event.maxCapacity > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="font-bold">Capacity:</span>
                    <span className="font-medium">{event.maxCapacity} visitors</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-gray-500">
                    Event Status
                  </div>
                  <div className={`px-3 py-1 border-2 border-black text-sm font-black ${isEventUpcoming(event.startTime)
                    ? 'bg-[#10B981] text-black'
                    : 'bg-gray-300 text-gray-700'
                    }`}>
                    {isEventUpcoming(event.startTime) ? 'ACTIVE' : 'COMPLETED'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">Create your first event to get started</p>
            <button
              onClick={handleAddEvent}
              className="bg-[#2563EB] text-white px-6 py-3 font-black border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              CREATE FIRST EVENT
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
      >
        {message.text && (
          <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Name"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            placeholder="Lion Feeding Show"
            required
          />

          <Input
            label="Description"
            textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the event..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />

            <Input
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Lion Habitat"
            required
          />

          <Input
            label="Max Capacity"
            type="number"
            min="0"
            value={formData.maxCapacity}
            onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
            placeholder="50"
          />

          <button
            type="submit"
            className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {editingEvent ? 'UPDATE EVENT' : 'CREATE EVENT'}
          </button>
        </form>
      </Modal>
    </div>
  );
}