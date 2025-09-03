import React, { useState, useEffect } from 'react';
import { Phone, User, Heart, Users, AlertTriangle, Printer, Camera } from 'lucide-react';

interface Contact {
  name: string;
  relationship: string;
  phone: string;
  details: string;
  type: 'primary' | 'secondary' | 'family' | 'work';
}

interface EmergencyService {
  name: string;
  number: string;
  description: string;
  type: 'emergency' | 'poison' | 'hospital';
}

function App() {
  const [age, setAge] = useState(38);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{ phone: string; name: string } | null>(null);

  const contacts: Contact[] = [
    {
      name: 'David Johnson',
      relationship: 'Husband',
      phone: '+15553456789',
      details: 'Available 24/7 - Lives at same address',
      type: 'primary'
    },
    {
      name: 'Emma Johnson',
      relationship: 'Daughter',
      phone: '+15556789012',
      details: 'Lives in Oakland, CA - Registered Nurse',
      type: 'secondary'
    },
    {
      name: 'Robert Martinez',
      relationship: 'Brother',
      phone: '+15558901234',
      details: 'Lives in San Jose, CA',
      type: 'family'
    },
    {
      name: 'Jennifer Walsh',
      relationship: 'Manager',
      phone: '+15550123456',
      details: 'TechCorp Solutions\nMon-Fri 8AM-6PM',
      type: 'work'
    }
  ];

  const emergencyServices: EmergencyService[] = [
    {
      name: 'Emergency',
      number: '911',
      description: 'Fire, Police, Ambulance',
      type: 'emergency'
    },
    {
      name: 'Poison Control',
      number: '18002221222',
      description: '24/7 Poison Help',
      type: 'poison'
    },
    {
      name: 'Preferred Hospital',
      number: '+14155676000',
      description: 'UCSF Medical Center',
      type: 'hospital'
    }
  ];

  useEffect(() => {
    calculateAge();
    loadLastUpdated();
  }, []);

  const calculateAge = () => {
    const birthDate = new Date('1985-03-15');
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    setAge(calculatedAge);
  };

  const loadLastUpdated = () => {
    const saved = localStorage.getItem('emergencyContactLastUpdated');
    if (saved) {
      setLastUpdated(saved);
    } else {
      updateTimestamp();
    }
  };

  const updateTimestamp = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    
    const timestamp = now.toLocaleDateString('en-US', options);
    setLastUpdated(timestamp);
    localStorage.setItem('emergencyContactLastUpdated', timestamp);
  };

  const handleEmergencyCall = (phone: string, name: string) => {
    setSelectedContact({ phone, name });
    setShowCallModal(true);
  };

  const confirmCall = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact.phone}`;
      logEmergencyCall(selectedContact.phone, selectedContact.name);
    }
    setShowCallModal(false);
    setSelectedContact(null);
  };

  const logEmergencyCall = (phoneNumber: string, contactName: string) => {
    const callLog = JSON.parse(localStorage.getItem('emergencyCallLog') || '[]');
    const timestamp = new Date().toISOString();
    
    callLog.push({
      phoneNumber,
      contactName,
      timestamp,
      type: 'emergency_call'
    });
    
    localStorage.setItem('emergencyCallLog', JSON.stringify(callLog));
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned === '911') {
      return '911';
    }
    
    return phone;
  };

  const printPage = () => {
    window.print();
  };

  const getContactCardClass = (type: string) => {
    const baseClass = "p-6 rounded-2xl text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl relative";
    
    switch (type) {
      case 'primary':
        return `${baseClass} bg-gradient-to-br from-emerald-50 to-emerald-100 border-3 border-emerald-500`;
      case 'secondary':
        return `${baseClass} bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500`;
      case 'family':
        return `${baseClass} bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500`;
      case 'work':
        return `${baseClass} bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-500`;
      default:
        return baseClass;
    }
  };

  const getServiceCardClass = (type: string) => {
    const baseClass = "p-6 rounded-2xl text-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl";
    
    switch (type) {
      case 'emergency':
        return `${baseClass} bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-600`;
      case 'poison':
        return `${baseClass} bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-500`;
      case 'hospital':
        return `${baseClass} bg-gradient-to-br from-sky-100 to-sky-200 border-2 border-sky-500`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Emergency Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-pulse">⚠️</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">EMERGENCY CONTACT INFORMATION</h1>
                <p className="text-red-200 font-medium">Keep this information accessible at all times</p>
              </div>
            </div>
            <button
              onClick={printPage}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border-2 border-white/30 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1"
            >
              <Printer size={20} />
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Personal Information */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="text-center">
              <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-blue-100 mb-4 mx-auto">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                  alt="Sarah Johnson - Emergency Contact Photo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 mx-auto">
                <Camera size={16} />
                Update Photo
              </button>
            </div>
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <User className="text-blue-500" size={32} />
                <h2 className="text-4xl font-bold text-gray-800">Sarah Johnson</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <div className="text-xl">📅</div>
                  <div>
                    <span className="block text-sm text-slate-600 font-medium">Date of Birth</span>
                    <span className="font-semibold">March 15, 1985 (Age: {age})</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-red-500">
                  <div className="text-xl">🩸</div>
                  <div>
                    <span className="block text-sm text-slate-600 font-medium">Blood Type</span>
                    <span className="font-bold text-red-600">O+ Positive</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <div className="text-xl">📍</div>
                  <div>
                    <span className="block text-sm text-slate-600 font-medium">Address</span>
                    <span className="font-semibold">1247 Oak Street<br />San Francisco, CA 94102</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <div className="text-xl">💳</div>
                  <div>
                    <span className="block text-sm text-slate-600 font-medium">Insurance</span>
                    <span className="font-semibold">Blue Cross Blue Shield<br />ID: BC123456789</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
            <Phone className="text-blue-500" size={28} />
            Contact Information
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {contacts.map((contact, index) => (
              <div key={index} className={getContactCardClass(contact.type)}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {contact.type === 'primary' ? 'Primary Contact' : 
                   contact.type === 'secondary' ? 'Secondary Contact' :
                   contact.type === 'family' ? 'Family Contact' : 'Work Contact'}
                </div>
                <h4 className="font-bold text-lg mt-4 mb-1">{contact.name}</h4>
                <p className="text-slate-600 italic mb-3">{contact.relationship}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-xl font-bold mb-3 hover:scale-105 transition-transform"
                >
                  {formatPhoneNumber(contact.phone)}
                </a>
                <p className="text-sm text-slate-600 mb-4 whitespace-pre-line">{contact.details}</p>
                <button
                  onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  🚨 Emergency Call
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2">
            <p><strong>Email:</strong> <a href="mailto:sarah.johnson@email.com" className="text-blue-600 hover:underline font-semibold">sarah.johnson@email.com</a></p>
            <p><strong>Work Email:</strong> <a href="mailto:s.johnson@techcorp.com" className="text-blue-600 hover:underline font-semibold">s.johnson@techcorp.com</a></p>
          </div>
        </section>

        {/* Medical Information */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
            <Heart className="text-red-500" size={28} />
            Medical Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-600 animate-pulse" size={24} />
                <h4 className="font-bold text-lg">Critical Allergies</h4>
              </div>
              <ul className="space-y-2">
                <li className="text-red-700 font-bold">Penicillin - Severe reaction</li>
                <li className="text-red-700 font-bold">Peanuts - Anaphylaxis risk</li>
                <li className="text-orange-600 font-semibold">Shellfish - Moderate reaction</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">💊</div>
                <h4 className="font-bold text-lg">Current Medications</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="font-medium">Lisinopril 10mg - Daily (morning)</li>
                <li className="font-medium">Metformin 500mg - Twice daily</li>
                <li className="font-medium">Vitamin D3 1000IU - Daily</li>
                <li className="font-medium">Rescue Inhaler - As needed</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🏥</div>
                <h4 className="font-bold text-lg">Medical Conditions</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="font-medium">Type 2 Diabetes - Well controlled</li>
                <li className="font-medium">Hypertension - Managed with medication</li>
                <li className="font-medium">Asthma - Mild, exercise-induced</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl border-2 border-sky-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">👨‍⚕️</div>
                <h4 className="font-bold text-lg">Healthcare Provider</h4>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg mb-2">Dr. Michael Chen</p>
                <a
                  href="tel:+15552345678"
                  className="block text-xl font-bold text-sky-600 hover:text-sky-700 mb-2"
                >
                  (555) 234-5678
                </a>
                <p className="text-sm text-slate-600">San Francisco Medical Center</p>
                <p className="text-sm text-slate-600">1500 Divisadero St, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
            <Users className="text-green-500" size={28} />
            Emergency Contacts
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contacts.map((contact, index) => (
              <div key={index} className={getContactCardClass(contact.type)}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {contact.type === 'primary' ? 'Primary Contact' : 
                   contact.type === 'secondary' ? 'Secondary Contact' :
                   contact.type === 'family' ? 'Family Contact' : 'Work Contact'}
                </div>
                <h4 className="font-bold text-lg mt-4 mb-1">{contact.name}</h4>
                <p className="text-slate-600 italic mb-3">{contact.relationship}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-xl font-bold mb-3 hover:scale-105 transition-transform"
                >
                  {formatPhoneNumber(contact.phone)}
                </a>
                <p className="text-sm text-slate-600 mb-4 whitespace-pre-line">{contact.details}</p>
                <button
                  onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  🚨 Emergency Call
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Services */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
            <AlertTriangle className="text-red-500" size={28} />
            Emergency Services
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyServices.map((service, index) => (
              <div key={index} className={getServiceCardClass(service.type)}>
                <h4 className="font-bold text-lg mb-3">{service.name}</h4>
                <a
                  href={`tel:${service.number}`}
                  className={`block font-black mb-2 hover:scale-105 transition-transform ${
                    service.type === 'emergency' ? 'text-4xl text-red-600' : 'text-2xl'
                  }`}
                >
                  {formatPhoneNumber(service.number)}
                </a>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                <button
                  onClick={() => handleEmergencyCall(service.number, service.name)}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    service.type === 'emergency' 
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  {service.type === 'emergency' ? '🚨 Call 911' : 
                   service.type === 'poison' ? '☎️ Call Now' : '🏥 Call Hospital'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300">
          <h3 className="flex items-center gap-3 text-2xl font-bold mb-6 text-gray-800">
            <div className="text-2xl">📋</div>
            Important Notes & Instructions
          </h3>
          
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-l-4 border-red-600">
              <h4 className="font-bold text-lg mb-4 text-red-800">🔴 Special Medical Instructions</h4>
              <ul className="space-y-2 text-sm">
                <li className="font-medium">Keep rescue inhaler in purse at all times</li>
                <li className="font-medium">Diabetic emergency kit located in kitchen cabinet</li>
                <li className="font-medium">Prefers UCSF Medical Center for emergency care</li>
                <li className="font-medium">Medical alert bracelet worn on right wrist</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl border-l-4 border-sky-600">
              <h4 className="font-bold text-lg mb-4 text-sky-800">🏠 Access Information</h4>
              <ul className="space-y-2 text-sm">
                <li className="font-medium">House key: Under flower pot on front porch</li>
                <li className="font-medium">Security system code: 1985 (birth year)</li>
                <li className="font-medium">Garage door opener in car visor</li>
                <li className="font-medium">Neighbor contact: Mrs. Chen - (555) 111-2222</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-l-4 border-gray-600 text-center">
              <p className="mb-4"><strong>Last Updated:</strong> {lastUpdated}</p>
              <button
                onClick={updateTimestamp}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1"
              >
                Update Timestamp
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Emergency Call Modal */}
      {showCallModal && selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold mb-4">Calling {selectedContact.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-6">{formatPhoneNumber(selectedContact.phone)}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:-translate-y-1"
              >
                <Phone size={20} />
                Proceed with Call
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;