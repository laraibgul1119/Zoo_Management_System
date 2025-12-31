import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { InventoryItem } from '../../types';
import { Plus, Edit, AlertTriangle } from 'lucide-react';

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food' as 'Food' | 'Medicine' | 'Equipment' | 'Supplies',
    quantity: '',
    unit: '',
    minThreshold: '',
    expiryDate: '',
    supplier: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setMessage({ type: 'error', text: 'Failed to load inventory' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Food',
      quantity: '',
      unit: '',
      minThreshold: '',
      expiryDate: '',
      supplier: ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minThreshold: item.minThreshold.toString(),
      expiryDate: item.expiryDate || '',
      supplier: item.supplier || ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.quantity || !formData.unit || !formData.minThreshold) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const itemData: any = {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      minThreshold: parseInt(formData.minThreshold),
      expiryDate: formData.expiryDate || null,
      supplier: formData.supplier || null
    };

    try {
      if (editingItem) {
        await api.updateInventoryItem(editingItem.id, itemData);
        setMessage({ type: 'success', text: 'Inventory item updated successfully!' });
      } else {
        const newItem = {
          ...itemData,
          id: `item-${Date.now()}`
        };
        await api.createInventoryItem(newItem);
        setMessage({ type: 'success', text: 'Inventory item added successfully!' });
      }
      fetchInventory();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving inventory item:', error);
      setMessage({ type: 'error', text: 'Failed to save inventory item' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingItem(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading inventory...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Inventory Control
          </h1>
          <p className="text-gray-600 font-bold">
            Track food, medicine, and equipment supplies
          </p>
        </div>
        <Button onClick={handleCreateItem}>
          <Plus className="w-5 h-5" /> Add Item
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <Card>
        <Table data={inventory} keyField="id" columns={[{
          header: 'Item Name',
          accessor: 'name'
        }, {
          header: 'Category',
          accessor: 'category'
        }, {
          header: 'Stock Level',
          accessor: item => <div className="flex items-center gap-2">
            <span className="font-bold">
              {item.quantity} {item.unit}
            </span>
            {item.quantity <= item.minThreshold && <span className="text-red-600 flex items-center gap-1 text-xs font-black uppercase border-2 border-red-600 px-1">
              <AlertTriangle className="w-3 h-3" /> Low Stock
            </span>}
          </div>
        }, {
          header: 'Expiry Date',
          accessor: item => item.expiryDate || 'N/A'
        }]} actions={(item: InventoryItem) => <button onClick={() => handleEditItem(item)} className="p-2 border-2 border-black hover:bg-gray-100">
          <Edit className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
    >
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Premium Lion Food"
          required
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Food' | 'Medicine' | 'Equipment' | 'Supplies' })}
          options={[
            { value: 'Food', label: 'Food' },
            { value: 'Medicine', label: 'Medicine' },
            { value: 'Equipment', label: 'Equipment' },
            { value: 'Supplies', label: 'Supplies' }
          ]}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="100"
            required
          />

          <Select
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={[
              { value: '', label: 'Select Unit' },
              { value: 'kg', label: 'kilograms' },
              { value: 'lbs', label: 'Pounds' },
              { value: 'pieces', label: 'Pieces' },
              { value: 'bottles', label: 'Bottles' },
              { value: 'boxes', label: 'Boxes' },
              { value: 'liters', label: 'Liters' },
              { value: 'gallons', label: 'Gallons' }
            ]}
            required
          />
        </div>

        <Input
          label="Minimum Threshold"
          type="number"
          min="0"
          value={formData.minThreshold}
          onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
          placeholder="10"
          required
        />

        <Input
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />

        <Input
          label="Supplier"
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
          placeholder="ABC Animal Supplies"
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingItem ? 'UPDATE ITEM' : 'ADD ITEM'}
        </button>
      </form>
    </Modal>
  </div>;
}