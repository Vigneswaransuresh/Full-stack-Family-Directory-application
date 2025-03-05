import React, { useState } from 'react';
import { User, MapPin, Calendar, Briefcase, Clock, Edit, Trash2, ChevronDown, ChevronUp, Users, Phone } from 'lucide-react';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onDelete: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onEdit, onDelete }) => {
  const [showFamilyMembers, setShowFamilyMembers] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not provided';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            <User className="inline mr-1.5 sm:mr-2 text-indigo-600" size={18} /> 
            {person.name}
          </h3>
          <div className="flex space-x-1 sm:space-x-2">
            <button 
              onClick={onEdit}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-1"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-2 text-gray-600 text-sm sm:text-base">
          <p className="flex items-center">
            <span className="font-medium mr-2">Sex:</span> {person.sex}
          </p>
          <p className="flex items-center">
            <Calendar className="inline mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" size={14} /> 
            <span className="truncate">Born: {formatDate(person.dateOfBirth)} at {formatTime(person.birthTime)}</span>
          </p>
          <p className="flex items-center">
            <MapPin className="inline mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" size={14} /> 
            <span className="truncate">Birth Place: {person.birthPlace}</span>
          </p>
          <p className="flex items-center">
            <Briefcase className="inline mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" size={14} /> 
            <span className="truncate">Profession: {person.profession}</span>
          </p>
          <p className="flex items-center">
            <MapPin className="inline mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" size={14} /> 
            <span className="truncate">Current City: {person.city}</span>
          </p>
          <p className="flex items-center">
            <Clock className="inline mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" size={14} /> 
            <span className="truncate">Last Visit: {formatDate(person.lastVisitDate)}</span>
          </p>
        </div>

        {person.familyMembers && person.familyMembers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowFamilyMembers(!showFamilyMembers)}
              className="flex items-center justify-between w-full text-left text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <span className="flex items-center">
                <Users size={16} className="mr-2" />
                Family Members ({person.familyMembers.length})
              </span>
              {showFamilyMembers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showFamilyMembers && (
              <div className="mt-3 space-y-3">
                {person.familyMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{member.name}</h4>
                      <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        {member.relationship}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {member.dateOfBirth && (
                        <p className="flex items-center">
                          <Calendar size={12} className="mr-1.5 text-gray-400" />
                          Born: {formatDate(member.dateOfBirth)}
                          {member.birthTime && ` at ${formatTime(member.birthTime)}`}
                        </p>
                      )}
                      {member.birthPlace && (
                        <p className="flex items-center">
                          <MapPin size={12} className="mr-1.5 text-gray-400" />
                          {member.birthPlace}
                        </p>
                      )}
                      {member.mobileNumber && (
                        <p className="flex items-center">
                          <Phone size={12} className="mr-1.5 text-gray-400" />
                          {member.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;