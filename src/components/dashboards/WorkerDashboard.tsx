import React, { useState } from 'react';
import {
  ClipboardList,
  Camera,
  CheckCircle,
  GraduationCap,
  QrCode,
  Globe,
  BarChart3,
  Clock,
  Mic,
  Target,
  Zap,
  Users,
  MapPin,
} from 'lucide-react';

import { User } from '../../App';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import TrainingSystem from '../training/TrainingSystem';

interface WorkerDashboardProps {
  user: User;
  onLogout: () => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const sidebarItems = [
    { icon: <ClipboardList className="w-5 h-5" />, label: 'My Tasks', active: activeTab === 'tasks', onClick: () => setActiveTab('tasks') },
    { icon: <Camera className="w-5 h-5" />, label: 'Submit Proof', active: activeTab === 'proof', onClick: () => setActiveTab('proof') },
    { icon: <CheckCircle className="w-5 h-5" />, label: 'Attendance', active: activeTab === 'attendance', onClick: () => setActiveTab('attendance') },
    { icon: <QrCode className="w-5 h-5" />, label: 'Digital ID', active: activeTab === 'digitalid', onClick: () => setActiveTab('digitalid') },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Training', active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <Globe className="w-5 h-5" />, label: 'Multilingual', active: activeTab === 'language', onClick: () => setActiveTab('language') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
              <p className="text-gray-600">Today's assigned tasks and progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tasks Today" value="6" icon={<ClipboardList className="w-6 h-6" />} color="blue" />
              <StatCard title="Completed" value="4" icon={<CheckCircle className="w-6 h-6" />} color="green" />
              <StatCard title="In Progress" value="1" icon={<Clock className="w-6 h-6" />} color="yellow" />
              <StatCard title="Performance" value="92%" icon={<BarChart3 className="w-6 h-6" />} trend={{ value: '5%', isPositive: true }} color="purple" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: 'T001', location: 'MG Road - Bin #45', type: 'Overflowing Bin', priority: 'High', status: 'Completed', time: '09:30 AM' },
                    { id: 'T002', location: 'Park Street - Area 12', type: 'Illegal Dumping', priority: 'Medium', status: 'Completed', time: '11:15 AM' },
                    { id: 'T003', location: 'Main Square - Bin #78', type: 'Missed Collection', priority: 'High', status: 'In Progress', time: '02:00 PM' },
                    { id: 'T004', location: 'City Center - Area 5', type: 'Cleaning Required', priority: 'Low', status: 'Pending', time: '03:30 PM' },
                  ].map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{task.id}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>{task.priority}</span>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>{task.status}</span>
                      </div>
                      <div className="mb-3">
                        <p className="font-medium text-gray-900">{task.type}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />{task.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Scheduled: {task.time}</span>
                        {task.status === 'Pending' && (
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">Start Task</button>
                        )}
                        {task.status === 'In Progress' && (
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">Submit Proof</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'proof':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Proof of Work</h2>
              <p className="text-gray-600">Upload geo-tagged photos to verify task completion</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Task: Main Square - Bin #78</h3>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Take Photo</h4>
                  <p className="text-gray-600 mb-4">Capture a geo-tagged photo of the completed work</p>
                  <div className="flex gap-3 justify-center">
                    <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">Open Camera</button>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
                      <Mic className="w-5 h-5" />Voice Note
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Photo Requirements</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Clear view of the work area</li>
                      <li>• GPS location must be enabled</li>
                      <li>• Photo must be taken at the task location</li>
                      <li>• Include before/after if applicable</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Task Details</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Type:</strong> Missed Collection</p>
                      <p><strong>Priority:</strong> High</p>
                      <p><strong>Location:</strong> Main Square - Bin #78</p>
                      <p><strong>Assigned:</strong> 02:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">Save as Draft</button>
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">Submit Completion</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Attendance & Check-in</h2>
              <p className="text-gray-600">Manage your daily attendance with facial recognition</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Days Present" value="22" icon={<CheckCircle className="w-6 h-6" />} trend={{ value: '2', isPositive: true }} color="green" />
              <StatCard title="This Month" value="95%" icon={<Target className="w-6 h-6" />} trend={{ value: '5%', isPositive: true }} color="blue" />
              <StatCard title="On-time Rate" value="98%" icon={<Clock className="w-6 h-6" />} trend={{ value: '3%', isPositive: true }} color="purple" />
              <StatCard title="Overtime Hours" value="12" icon={<Zap className="w-6 h-6" />} color="yellow" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Check-in</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Facial Recognition Check-in</h4>
                  <p className="text-gray-600 mb-4">Position your face in the camera frame</p>
                  <button className="bg-green-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">Start Check-in</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Today's Status</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-gray-600">Check-in Time:</span><span className="font-medium text-green-600">08:00 AM</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="font-medium">Zone A Office</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className="font-medium text-green-600">On Time</span></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Digital ID Preview</h5>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">Worker ID: W{user.id.slice(-4)}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded mx-auto flex items-center justify-center">
                          <span className="text-xs">QR Code</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'digitalid':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Digital ID Card</h2>
              <p className="text-gray-600">Your unique digital identification</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-green-100">Waste Management Worker</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between"><span className="text-green-100">Worker ID:</span><span className="font-semibold">W{user.id.slice(-4)}</span></div>
                  <div className="flex justify-between"><span className="text-green-100">Department:</span><span className="font-semibold">Zone A</span></div>
                  <div className="flex justify-between"><span className="text-green-100">Valid Until:</span><span className="font-semibold">Dec 2025</span></div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-lg mx-auto flex items-center justify-center mb-2">
                    <QrCode className="w-16 h-16 text-gray-800" />
                  </div>
                  <p className="text-xs text-green-100">Scan for verification</p>
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ID Card Features</h3>
                <div className="space-y-3 text-sm">
                  {[
                    'Unique QR code for instant verification',
                    'Digital signature and security features',
                    'Works offline for field verification',
                    'Linked to attendance and performance data',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'training':
        return <TrainingSystem user={user} />;

      case 'language':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Language Settings</h2>
              <p className="text-gray-600">Choose your preferred language for the app</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', selected: true },
                    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', selected: false },
                    { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰', selected: false },
                    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳', selected: false },
                  ].map((lang, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${lang.selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <p className="font-medium text-gray-900">{lang.name}</p>
                          <p className="text-sm text-gray-600">{lang.native}</p>
                        </div>
                        {lang.selected && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Voice-to-Text Support</h4>
                      <p className="text-sm text-blue-800">
                        Voice commands are available for task reporting and proof submission in all supported languages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-600">This feature is under development</p>
          </div>
        );
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} sidebarItems={sidebarItems}>
      {renderContent()}
    </Layout>
  );
};

export default WorkerDashboard;