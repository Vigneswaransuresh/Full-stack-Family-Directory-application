import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, X, Plus, Edit, Trash2 } from 'lucide-react';
import PersonForm from './components/PersonForm';
import SearchBar from './components/SearchBar';
import PersonCard from './components/PersonCard';
import InstallPrompt from './components/InstallPrompt';
import { Person } from './types';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from './api/customers';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const customers = await getCustomers();
      setPeople(customers);
    } catch (err) {
      setError('Failed to load customers. Please try again later.');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPerson = async (person: Person) => {
    try {
      const newCustomer = await createCustomer(person);
      setPeople([newCustomer, ...people]);
      setIsAddingPerson(false);
    } catch (err) {
      setError('Failed to add customer. Please try again.');
      console.error('Error adding customer:', err);
    }
  };

  const handleUpdatePerson = async (updatedPerson: Person) => {
    try {
      const updated = await updateCustomer(updatedPerson.id, updatedPerson);
      setPeople(people.map(p => p.id === updated.id ? updated : p));
      setEditingPerson(null);
    } catch (err) {
      setError('Failed to update customer. Please try again.');
      console.error('Error updating customer:', err);
    }
  };

  const handleDeletePerson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await deleteCustomer(id);
      setPeople(people.filter(person => person.id !== id));
    } catch (err) {
      setError('Failed to delete customer. Please try again.');
      console.error('Error deleting customer:', err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = people.filter(person => 
      person.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">Customer Directory</h1>
          <p className="text-sm sm:text-base text-gray-600">Kalaivani Jothidam customers and their details</p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <SearchBar onSearch={handleSearch} />
          
          {searchQuery && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                  Search Results ({searchResults.length})
                </h2>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X size={16} className="mr-1" /> Clear
                </button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {searchResults.map(person => (
                    <PersonCard 
                      key={person.id} 
                      person={person} 
                      onEdit={() => setEditingPerson(person)}
                      onDelete={() => handleDeletePerson(person.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No results found for "{searchQuery}"</p>
              )}
            </div>
          )}
        </div>

        {!isAddingPerson && !editingPerson && !searchQuery && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                <Users className="inline mr-2" size={20} /> 
                All Customers ({people.length})
              </h2>
              <button
                onClick={() => setIsAddingPerson(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start transition-colors w-full sm:w-auto"
              >
                <UserPlus size={18} className="mr-2" /> Add Customer
              </button>
            </div>

            {people.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {people.map(person => (
                  <PersonCard 
                    key={person.id} 
                    person={person} 
                    onEdit={() => setEditingPerson(person)}
                    onDelete={() => handleDeletePerson(person.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                <Users size={40} className="mx-auto text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">No customers added yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">Start by adding a customer to your directory</p>
                <button
                  onClick={() => setIsAddingPerson(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
                >
                  <Plus size={18} className="mr-2" /> Add Your First Customer
                </button>
              </div>
            )}
          </div>
        )}

        {(isAddingPerson || editingPerson) && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {editingPerson ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button
                onClick={() => {
                  setIsAddingPerson(false);
                  setEditingPerson(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <PersonForm 
              onSubmit={editingPerson ? handleUpdatePerson : handleAddPerson} 
              initialData={editingPerson || undefined}
            />
          </div>
        )}
      </div>
      
      <InstallPrompt />
    </div>
  );
}

export default App;