import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Person, FamilyMember } from '../types';

interface PersonFormProps {
  onSubmit: (person: Person) => void;
  initialData?: Person;
}

const PersonForm: React.FC<PersonFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    name: '',
    sex: '',
    dateOfBirth: '',
    birthTime: '',
    birthPlace: '',
    profession: '',
    city: '',
    lastVisitDate: new Date().toISOString().split('T')[0],
    familyMembers: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sex: initialData.sex,
        dateOfBirth: initialData.dateOfBirth,
        birthTime: initialData.birthTime,
        birthPlace: initialData.birthPlace,
        profession: initialData.profession,
        city: initialData.city,
        lastVisitDate: initialData.lastVisitDate,
        familyMembers: initialData.familyMembers
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id || ''
    });
    
    if (!initialData) {
      setFormData({
        name: '',
        sex: '',
        dateOfBirth: '',
        birthTime: '',
        birthPlace: '',
        profession: '',
        city: '',
        lastVisitDate: new Date().toISOString().split('T')[0],
        familyMembers: []
      });
    }
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        {
          id: Date.now().toString(),
          name: '',
          relationship: '',
          dateOfBirth: '',
          birthTime: '',
          birthPlace: '',
          mobileNumber: ''
        }
      ]
    }));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, familyMembers: updatedMembers }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Full Name"
          />
        </div>
        
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
            Sex *
          </label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-1">
            Birth Time *
          </label>
          <input
            type="time"
            id="birthTime"
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
            Birth Place *
          </label>
          <input
            type="text"
            id="birthPlace"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            Profession *
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Current Profession"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Current City"
          />
        </div>

        <div>
          <label htmlFor="lastVisitDate" className="block text-sm font-medium text-gray-700 mb-1">
            Last Visit Date *
          </label>
          <input
            type="date"
            id="lastVisitDate"
            name="lastVisitDate"
            value={formData.lastVisitDate}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Family Members</h3>
          <button
            type="button"
            onClick={addFamilyMember}
            className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
          >
            <Plus size={16} className="mr-2" />
            Add Family Member
          </button>
        </div>

        <div className="space-y-4">
          {formData.familyMembers.map((member, index) => (
            <div key={member.id} className="bg-gray-50 rounded-lg p-4 relative border border-gray-200">
              <button
                type="button"
                onClick={() => removeFamilyMember(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Family Member Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={member.relationship}
                    onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Spouse, Child"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={member.dateOfBirth}
                    onChange={(e) => updateFamilyMember(index, 'dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Time
                  </label>
                  <input
                    type="time"
                    value={member.birthTime}
                    onChange={(e) => updateFamilyMember(index, 'birthTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Place
                  </label>
                  <input
                    type="text"
                    value={member.birthPlace}
                    onChange={(e) => updateFamilyMember(index, 'birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={member.mobileNumber}
                    onChange={(e) => updateFamilyMember(index, 'mobileNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Mobile Number"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.familyMembers.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No family members added yet. Click the button above to add family members.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Customer' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
};

export default PersonForm;