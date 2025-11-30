import React, { useState, useEffect } from 'react';
import { Plus, Package, ShoppingBag, Trash2, Printer } from 'lucide-react';
import { Product, Order, Category } from '../types';
import { productService, orderService } from '../services/api';
import { CATEGORIES } from '../constants';
import Invoice from './Invoice';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-brand-cyan' : 'hover:bg-brand-slate'}`}
            >
              Manage Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-brand-cyan' : 'hover:bg-brand-slate'}`}
            >
              Manage Orders
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'products' ? <ProductManager /> : <OrderManager />}
      </div>
    </div>
  );
};

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Freshwater', price: 0, stock: 0, origin: '', description: '', image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => productService.getAll().then(setProducts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    // In a real app, upload image to Cloudinary here
    const productToSave = {
        ...formData,
        image: formData.image || 'https://picsum.photos/400/400' // Fallback
    } as Product;

    await productService.add(productToSave);
    setIsAdding(false);
    setFormData({ name: '', category: 'Freshwater', price: 0, stock: 0, origin: '', description: '', image: '' });
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await productService.delete(id);
      loadProducts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Product Inventory</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Product Name" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <select className="border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price" className="border p-2 rounded" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
            <input type="number" placeholder="Offer Price (Optional)" className="border p-2 rounded" value={formData.offerPrice || ''} onChange={e => setFormData({...formData, offerPrice: Number(e.target.value)})} />
            <input type="number" placeholder="Stock Qty" className="border p-2 rounded" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} required />
            <input type="text" placeholder="Origin" className="border p-2 rounded" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} />
            <input type="text" placeholder="Image URL" className="border p-2 rounded" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            <textarea placeholder="Description" className="border p-2 rounded md:col-span-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-cyan text-white rounded">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded object-cover" alt="" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {p.offerPrice ? <><span className="line-through text-gray-400 mr-2">₹{p.price}</span>₹{p.offerPrice}</> : `₹${p.price}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    orderService.getAll().then(setOrders);
  }, []);

  const handleStatusUpdate = async (id: string, status: Order['status']) => {
    await orderService.updateStatus(id, status);
    const updated = await orderService.getAll();
    setOrders(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Order Management</h2>
      <div className="grid gap-6">
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">By {order.userName} ({order.userPhone}) on {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  order.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-gray-600 hover:text-brand-cyan"
                  title="Print Invoice"
                >
                  <Printer size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span>{item.quantity} x {item.name}</span>
                  <span>₹{(item.offerPrice || item.price) * item.quantity}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {order.status === 'pending' && (
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'paid')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Mark Paid
                </button>
              )}
              {order.status === 'paid' && (
                <button 
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <div className="p-4 flex justify-between print:hidden">
                <h3 className="font-bold">Invoice Preview</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-red-500">Close</button>
            </div>
            <Invoice order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;