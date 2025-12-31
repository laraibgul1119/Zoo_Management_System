import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { ZooEvent } from '../../types';
import { Plus, Edit, Calendar, MapPin, Trash2 } from 'lucide-react';

export function EventManagementPage() {
  const [events, setEvents] = useState<ZooEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ZooEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<ZooEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    status: 'Upcoming' as 'Upcoming' | 'Completed' | 'Cancelled'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      status: 'Upcoming'
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditEvent = (event: ZooEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: event.capacity.toString(),
      status: event.status
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteEvent = (event: ZooEvent) => {
    setDeletingEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      await api.deleteEvent(deletingEvent.id);
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      fetchEvents();
      setShowDeleteModal(false);
      setDeletingEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage({ type: 'error', text: 'Failed to delete event' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const eventData: Partial<ZooEvent> = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: parseInt(formData.capacity) || 50,
      registeredCount: editingEvent ? editingEvent.registeredCount : 0,
      status: formData.status
    };

    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, eventData);
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        const newEvent = {
          ...eventData,
          id: `event-${Date.now()}`
        };
        await api.createEvent(newEvent);
        setMessage({ type: 'success', text: 'Event created successfully!' });
      }
      fetchEvents();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage({ type: 'error', text: 'Failed to save event' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setMessage({ type: '', text: '' });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingEvent(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-xl font-bold text-gray-600">Loading events...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Schedule shows, feedings, and tours</p>
        </div>
        <Button onClick={handleCreateEvent} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <Card>
        <Table 
          data={events} 
          keyField="id" 
          columns={[
            {
              header: 'Event Name',
              accessor: 'title'
            }, 
            {
              header: 'Date & Time',
              accessor: e => (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {e.date} at {e.time}
                </div>
              )
            }, 
            {
              header: 'Location',
              accessor: e => (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {e.location}
                </div>
              )
            }, 
            {
              header: 'Registrations',
              accessor: e => `${e.registeredCount} / ${e.capacity}`
            }, 
            {
              header: 'Status',
              accessor: e => (
                <Badge variant={e.status === 'Upcoming' ? 'success' : 'neutral'}>
                  {e.status}
                </Badge>
              )
            }
          ]} 
          actions={(event: ZooEvent) => (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleEditEvent(event)} 
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Event"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteEvent(event)} 
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )} 
        />
      </Card>

      {/* Create/Edit Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModal}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
      >
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
            label="Capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="50"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Upcoming' | 'Completed' | 'Cancelled' })}
            options={[
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' }
            ]}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the event "{deletingEvent?.title}"? This action cannot be undone.
          </p>
          
          {deletingEvent && deletingEvent.registeredCount > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Warning: This event has {deletingEvent.registeredCount} registered participants.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete Event
            </button>
            <button
              onClick={closeDeleteModal}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}