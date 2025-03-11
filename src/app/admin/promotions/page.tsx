'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Search, Filter, Eye, X, CheckSquare, Tag } from 'lucide-react';

function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState([
    { 
      id: 1, 
      title: 'Garba Night Offer', 
      description: 'Get 20% off on tickets when booking for groups of 5 or more!', 
      startDate: '2025-03-15', 
      endDate: '2025-03-20',
      category: 'Cultural',
      isActive: true,
      discount: 20,
      code: 'GARBA20'
    },
    { 
      id: 2, 
      title: 'MakerCarnival Discount', 
      description: 'Early bird discount for the annual maker festival. Limited spots available!', 
      startDate: '2025-03-10', 
      endDate: '2025-03-18',
      category: 'Technical',
      isActive: true,
      discount: 15,
      code: 'MAKER15'
    },
    { 
      id: 3, 
      title: 'Alumni Meet Special', 
      description: 'Special pricing for alumni attending the annual networking event', 
      startDate: '2025-04-05', 
      endDate: '2025-04-10',
      category: 'Networking',
      isActive: false,
      discount: 25,
      code: 'ALUMNI25'
    }
  ]);
  
  const [newPromotion, setNewPromotion] = useState({ 
    title: '', 
    description: '', 
    startDate: '', 
    endDate: '',
    category: 'General',
    isActive: true,
    discount: 0,
    code: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const categories = ['General', 'Cultural', 'Technical', 'Sports', 'Academic', 'Networking'];
  
  interface Promotion {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    category: string;
    isActive: boolean;
    discount: number;
    code: string;
  }

  interface NewPromotion {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    category: string;
    isActive: boolean;
    discount: number;
    code: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const checked = (e.target as HTMLInputElement).checked;
    setNewPromotion({ 
      ...newPromotion, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const generatePromotionCode = () => {
    if (!newPromotion.title) return '';
    const codeBase = newPromotion.title.replace(/[^A-Z0-9]/ig, '').substring(0, 6).toUpperCase();
    const discount = newPromotion.discount || 0;
    return `${codeBase}${discount}`;
  };
  
  const addPromotion = () => {
    if (!newPromotion.title || !newPromotion.description || !newPromotion.startDate || !newPromotion.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (new Date(newPromotion.startDate) > new Date(newPromotion.endDate)) {
      alert('End date cannot be before start date');
      return;
    }
    
    const promotionToAdd = { 
      ...newPromotion, 
      id: Date.now(),
      code: newPromotion.code || generatePromotionCode()
    };
    
    setPromotions([...promotions, promotionToAdd]);
    setNewPromotion({ 
      title: '', 
      description: '', 
      startDate: '', 
      endDate: '',
      category: 'General',
      isActive: true,
      discount: 0,
      code: ''
    });
    setShowForm(false);
  };
  
  interface PromotionToEdit {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    category: string;
    isActive: boolean;
    discount: number;
    code: string;
  }

  const startEditing = (promotion: PromotionToEdit) => {
    setIsEditing(true);
    setEditId(promotion.id);
    setNewPromotion({...promotion});
    setShowForm(true);
  };
  
  const updatePromotion = () => {
    if (!newPromotion.title || !newPromotion.description || !newPromotion.startDate || !newPromotion.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    setPromotions(promotions.map(promo => 
      promo.id === editId ? {...newPromotion, id: promo.id} : promo
    ));
    
    setNewPromotion({ 
      title: '', 
      description: '', 
      startDate: '', 
      endDate: '',
      category: 'General',
      isActive: true,
      discount: 0,
      code: ''
    });
    setIsEditing(false);
    setEditId(null);
    setShowForm(false);
  };
  
  const deletePromotion = (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(promo => promo.id !== id));
    }
  };
  
  const togglePromotionStatus = (id: number) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? {...promo, isActive: !promo.isActive} : promo
    ));
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewPromotion({ 
      title: '', 
      description: '', 
      startDate: '', 
      endDate: '',
      category: 'General',
      isActive: true,
      discount: 0,
      code: ''
    });
    setShowForm(false);
  };
  
  interface SortHandler {
    (field: string): void;
  }

  const handleSort: SortHandler = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort promotions
  const filteredPromotions = promotions
    .filter(promo => {
      const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            promo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            promo.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || promo.category === filterCategory;
      
      const matchesStatus = filterStatus === 'All' || 
                           (filterStatus === 'Active' && promo.isActive) || 
                           (filterStatus === 'Inactive' && !promo.isActive);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'startDate') {
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortBy === 'discount') {
        comparison = a.discount - b.discount;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Check for expired promotions
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPromotions(promotions.map(promo => {
      if (promo.endDate < today && promo.isActive) {
        return {...promo, isActive: false};
      }
      return promo;
    }));
  }, []);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Promotions Dashboard</h1>
            <button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
              onClick={() => {
                setShowForm(!showForm);
                if (isEditing) cancelEdit();
              }}
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'New Promotion'}
            </button>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:outline-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative flex-1">
                  <CheckSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                  <select
                    className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1 ${sortBy === 'startDate' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                  onClick={() => handleSort('startDate')}
                >
                  <Calendar size={16} />
                  Date {sortBy === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1 ${sortBy === 'title' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                  onClick={() => handleSort('title')}
                >
                  Name {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-1 ${sortBy === 'discount' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                  onClick={() => handleSort('discount')}
                >
                  % Off {sortBy === 'discount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {isEditing ? 'Edit Promotion' : 'Create New Promotion'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  type="text" 
                  name="title" 
                  placeholder="Promotion title" 
                  value={newPromotion.title} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  name="category"
                  value={newPromotion.category}
                  onChange={handleChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-24"
                name="description" 
                placeholder="Detailed description of the promotion" 
                value={newPromotion.description} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date *
                </label>
                <input 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  type="date" 
                  name="startDate" 
                  value={newPromotion.startDate} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date *
                </label>
                <input 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  type="date" 
                  name="endDate" 
                  value={newPromotion.endDate} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Percentage
                </label>
                <input 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  type="number" 
                  name="discount" 
                  placeholder="Discount %" 
                  min="0"
                  max="100"
                  value={newPromotion.discount} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    type="text" 
                    name="code" 
                    placeholder="Promotion code" 
                    value={newPromotion.code} 
                    onChange={handleChange} 
                  />
                  <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 rounded-lg text-sm"
                    type="button"
                    onClick={() => setNewPromotion({...newPromotion, code: generatePromotionCode()})}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="isActive" 
                name="isActive" 
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                checked={newPromotion.isActive} 
                onChange={handleChange} 
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Active
              </label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                onClick={isEditing ? updatePromotion : addPromotion}
              >
                {isEditing ? 'Update Promotion' : 'Create Promotion'}
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Promotions ({filteredPromotions.length})
            </h2>
          </div>
          
          {filteredPromotions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Filter size={32} className="mx-auto mb-2 opacity-50" />
              <p>No promotions found matching your filters</p>
              {(searchTerm || filterCategory !== 'All' || filterStatus !== 'All') && (
                <button 
                  className="mt-2 text-blue-500 hover:underline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('All');
                    setFilterStatus('All');
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {promo.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {promo.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {promo.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{promo.startDate} to {promo.endDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Tag size={14} className="mr-1" />
                          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {promo.code || '-'}
                          </span>
                          {promo.discount > 0 && (
                            <span className="ml-2 text-sm text-green-600 font-semibold">
                              {promo.discount}% off
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            promo.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => togglePromotionStatus(promo.id)}
                            title={promo.isActive ? 'Deactivate' : 'Activate'}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => startEditing(promo)}
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => deletePromotion(promo.id)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PromotionsAdminPage;