import { useState, useEffect } from 'react';
import { Ticket, Plus, Edit, Trash2, Calendar, DollarSign, Percent, ArrowLeft } from 'lucide-react';
import { Ticket as TicketType } from '../types';
import { api } from '../utils/api';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

interface TicketsPageProps {
  onBack: () => void;
}

export function TicketsPage({ onBack }: TicketsPageProps) {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [formData, setFormData] = useState({
    startDate: '',
    price: '',
    discountPercentage: '',
    type: 'Standard',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setMessage({ type: 'error', text: 'Failed to load tickets' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTicket = () => {
    setEditingTicket(null);
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      price: '',
      discountPercentage: '0',
      type: 'Standard',
      description: ''
    });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditTicket = (ticket: TicketType) => {
    setEditingTicket(ticket);
    setFormData({
      startDate: ticket.startDate,
      price: ticket.price.toString(),
      discountPercentage: ticket.discountPercentage.toString(),
      type: ticket.type || 'Standard',
      description: ticket.description || ''
    });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      try {
        await api.deleteTicket(id);
        setMessage({ type: 'success', text: 'Ticket deleted successfully!' });
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        setMessage({ type: 'error', text: 'Failed to delete ticket' });
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.price) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const ticketData: any = {
      startDate: formData.startDate,
      price: parseFloat(formData.price),
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      type: formData.type,
      description: formData.description
    };

    try {
      if (editingTicket) {
        await api.updateTicket(editingTicket.id, ticketData);
        setMessage({ type: 'success', text: 'Ticket updated successfully!' });
      } else {
        const newTicket = {
          ...ticketData,
          id: `T${Date.now()}`
        };
        await api.createTicket(newTicket);
        setMessage({ type: 'success', text: 'Ticket created successfully!' });
      }
      fetchTickets();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving ticket:', error);
      setMessage({ type: 'error', text: 'Failed to save ticket' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTicket(null);
    setMessage({ type: '', text: '' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading tickets...</div>
    </div>;
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
                <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-black">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase">Ticket Management</h1>
                  <p className="text-gray-600 font-medium">Manage zoo admission tickets and pricing</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddTicket}
              className="bg-[#10B981] text-black px-6 py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              ADD TICKET
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

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#FBBF24] px-3 py-1 border-2 border-black">
                  <span className="font-black text-sm">{ticket.id}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTicket(ticket)}
                    className="bg-[#2563EB] text-white p-2 border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="bg-[#EF4444] text-white p-2 border-2 border-black hover:bg-[#DC2626] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2563EB]" />
                  <span className="font-bold">Valid from:</span>
                  <span className="font-medium">{new Date(ticket.startDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#10B981]" />
                  <span className="font-bold">Price:</span>
                  <span className="font-medium">{formatPrice(ticket.price)}</span>
                </div>

                {ticket.discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-[#F97316]" />
                    <span className="font-bold">Discount:</span>
                    <span className="font-medium">{ticket.discountPercentage}%</span>
                  </div>
                )}

                {ticket.discountPercentage > 0 && (
                  <div className="bg-[#F97316] p-3 border-2 border-black mt-4">
                    <div className="text-center">
                      <div className="font-black text-white text-lg">
                        FINAL PRICE: {formatPrice(calculateDiscountedPrice(ticket.price, ticket.discountPercentage))}
                      </div>
                      <div className="text-sm font-bold text-black">
                        Save {formatPrice(ticket.price * ticket.discountPercentage / 100)}!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-4">Create your first ticket to get started</p>
            <button
              onClick={handleAddTicket}
              className="bg-[#2563EB] text-white px-6 py-3 font-black border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              CREATE FIRST TICKET
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingTicket ? 'Edit Ticket' : 'Add New Ticket'}
      >
        {message.text && (
          <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Valid From Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="25.00"
            required
          />

          <Input
            label="Discount Percentage (%)"
            type="number"
            min="0"
            max="100"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
            placeholder="0"
          />

          <button
            type="submit"
            className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {editingTicket ? 'UPDATE TICKET' : 'CREATE TICKET'}
          </button>
        </form>
      </Modal>
    </div>
  );
}