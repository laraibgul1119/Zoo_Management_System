import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { api } from '../../utils/api';
import { ZooEvent, TicketSale } from '../../types';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';

export function EventsPage() {
  const [events, setEvents] = useState<ZooEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ZooEvent | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseData, setPurchaseData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // Event ticket prices
  const eventTicketPrice = 15; // Special event ticket price

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      // Filter for upcoming events to show to public
      setEvents(data.filter((e: ZooEvent) => e.status === 'Upcoming'));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyEventTicket = (event: ZooEvent) => {
    setSelectedEvent(event);
    setShowTicketModal(true);
    setPurchaseComplete(false);
  };

  const handleSubmitPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsProcessing(true);

    try {
      const visitorName = `${purchaseData.firstName} ${purchaseData.lastName}`;
      const date = new Date().toISOString().split('T')[0];

      // 1. Create the ticket sale record
      const saleData: Partial<TicketSale> = {
        id: `sale-evt-${Date.now()}`,
        ticketId: 'EVENT', // Special marker for event tickets if not in tickets table
        quantity: ticketQuantity,
        totalAmount: totalPrice,
        date: date,
        visitorName: visitorName,
        visitorEmail: purchaseData.email,
        visitorPhone: purchaseData.phone
      };

      await api.createTicketSale(saleData);

      // 2. Update the event's registered count
      const updatedEvent = {
        ...selectedEvent,
        registeredCount: selectedEvent.registeredCount + ticketQuantity
      };

      await api.updateEvent(selectedEvent.id, updatedEvent);

      setIsProcessing(false);
      setPurchaseComplete(true);

      // Refresh events to show updated count
      fetchEvents();

      setTimeout(() => {
        setShowTicketModal(false);
        setPurchaseComplete(false);
        setTicketQuantity(1);
        setPurchaseData({
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setSelectedEvent(null);
      }, 5000);
    } catch (error) {
      console.error('Error processing event ticket purchase:', error);
      setIsProcessing(false);
      alert('Failed to process purchase. Please try again.');
    }
  };

  const closeModal = () => {
    setShowTicketModal(false);
    setPurchaseComplete(false);
    setSelectedEvent(null);
  };

  const totalPrice = ticketQuantity * eventTicketPrice;

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase tracking-tighter">Loading Events...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <nav className="border-b-4 border-black py-4 px-4 bg-[#10B981]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden group-hover:scale-110 transition-transform">
            <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-black uppercase tracking-tighter">
            Zootopia Events
          </span>
        </Link>
        <Link to="/tickets" className="font-bold border-2 border-black bg-white px-4 py-2 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
          Buy Tickets
        </Link>
      </div>
    </nav>

    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black uppercase mb-4">
          Upcoming Events
        </h1>
        <p className="text-xl font-bold text-gray-600">
          Don't miss out on our daily shows and activities
        </p>
      </div>

      <div className="space-y-6">
        {events.length > 0 ? (
          events.map(event => (
            <Card key={event.id} className="hover:translate-x-2 transition-transform duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-48 bg-[#FBBF24] border-2 border-black flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-4xl font-black">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xl font-bold uppercase">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold mt-2">{event.time}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black uppercase">
                      {event.title}
                    </h3>
                    <Badge variant={event.status === 'Upcoming' ? 'success' : 'neutral'}>
                      {event.status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 font-medium mb-4 text-lg">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.registeredCount} / {event.capacity} Registered
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  </div>

                  {/* Event Ticket Purchase Section */}
                  <div className="bg-[#F3F4F6] p-4 border-2 border-black">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-lg">Special Event Ticket</h4>
                        <p className="text-sm font-medium text-gray-600">
                          Includes zoo admission + reserved seating for this event
                        </p>
                        <p className="font-black text-[#2563EB] text-xl">${eventTicketPrice}</p>
                      </div>
                      <Button
                        onClick={() => handleBuyEventTicket(event)}
                        disabled={event.status !== 'Upcoming' || event.registeredCount >= event.capacity}
                        className="flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        {event.registeredCount >= event.capacity ? 'Sold Out' : 'Buy Ticket'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white border-4 border-black border-dashed">
            <p className="text-xl font-bold text-gray-500">No upcoming events scheduled at the moment.</p>
            <p className="font-bold text-gray-400">Check back later for exciting shows!</p>
          </div>
        )}
      </div>
    </div>

    <Modal
      isOpen={showTicketModal && selectedEvent !== null}
      onClose={closeModal}
      title={purchaseComplete ? 'Ticket Purchased!' : 'Buy Event Ticket'}
    >
      {selectedEvent && (
        <>
          {purchaseComplete ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-black mb-2">Ticket Purchased Successfully!</h4>
              <p className="text-gray-600 font-medium mb-4">
                Your event ticket has been confirmed. You will receive a confirmation email with your ticket details.
              </p>
              <div className="bg-[#FBBF24] p-4 border-2 border-black">
                <p className="font-black">{selectedEvent.title}</p>
                <p className="text-sm font-bold">{selectedEvent.date} at {selectedEvent.time}</p>
                <p className="text-sm font-bold">Location: {selectedEvent.location}</p>
                <p className="font-black mt-2">Total: ${totalPrice}</p>
                <p className="text-sm font-bold">Confirmation #: EVT-{Date.now()}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Event Details */}
              <div className="mb-6 p-4 bg-[#FBBF24] border-2 border-black">
                <h4 className="font-black text-lg mb-2">{selectedEvent.title}</h4>
                <div className="space-y-1 text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedEvent.date} at {selectedEvent.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedEvent.location}
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="mb-6 p-4 bg-gray-50 border-2 border-black">
                <h4 className="font-black mb-3">Ticket Details</h4>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold">Special Event Ticket</p>
                    <p className="text-sm text-gray-600">Includes zoo admission + reserved seating</p>
                  </div>
                  <p className="font-black text-xl">${eventTicketPrice}</p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="font-bold">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black">{ticketQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-[#10B981] border-2 border-black hover:bg-[#059669]"
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-auto">
                    <p className="font-black text-lg">Total: ${totalPrice}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitPurchase} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={purchaseData.firstName}
                    onChange={(e) => setPurchaseData({ ...purchaseData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={purchaseData.lastName}
                    onChange={(e) => setPurchaseData({ ...purchaseData, lastName: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={purchaseData.email}
                  onChange={(e) => setPurchaseData({ ...purchaseData, email: e.target.value })}
                  required
                />

                <Input
                  label="Phone"
                  type="tel"
                  value={purchaseData.phone}
                  onChange={(e) => setPurchaseData({ ...purchaseData, phone: e.target.value })}
                  required
                />

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#10B981] text-black py-4 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Purchase Ticket - $${totalPrice}`}
                </button>
              </form>
            </>
          )}
        </>
      )}
    </Modal>
  </div>;
}