import React, { useState, useRef } from 'react';
import {
  ClipboardList,
  Camera,
  CheckCircle,
  GraduationCap,
  QrCode,
  BarChart3,
  Clock,
  Target,
  Zap,
  Users,
  MapPin,
  X,
  Loader2,
  UserCircle,
} from 'lucide-react';

import { User } from '../../App';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import TrainingSystem from '../training/TrainingSystem';
import ProfilePage from '../common/ProfilePage';
import SettingsTab from './tabs/SettingsTab';
import { Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface WorkerDashboardProps {
  user: User;
  onLogout: () => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tasks');

  // ----------- Geo-tagged proof photos -----------
  interface GeoPhoto {
    file: File;
    preview: string;
    lat?: number;
    lng?: number;
    address?: string;
    geoLoading?: boolean;
  }
  const [proofPhotos, setProofPhotos] = useState<GeoPhoto[]>([]);
  const proofCameraInputRef = useRef<HTMLInputElement>(null);
  const proofGalleryInputRef = useRef<HTMLInputElement>(null);

  const captureGpsForProof = (index: number) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        let address = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          if (data.display_name) address = data.display_name;
        } catch { /* fallback */ }
        setProofPhotos((prev) =>
          prev.map((p, i) =>
            i === index
              ? { ...p, lat: coords.latitude, lng: coords.longitude, address, geoLoading: false }
              : p
          )
        );
      },
      () => {
        setProofPhotos((prev) =>
          prev.map((p, i) => (i === index ? { ...p, geoLoading: false } : p))
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleProofPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - proofPhotos.length;
    const startIndex = proofPhotos.length;
    const toAdd: GeoPhoto[] = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      geoLoading: true,
    }));
    setProofPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((_, i) => captureGpsForProof(startIndex + i));
    e.target.value = '';
  };

  const removeProofPhoto = (index: number) => {
    setProofPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const sidebarItems = [
    { icon: <ClipboardList className="w-5 h-5" />, label: t('my_tasks'), active: activeTab === 'tasks', onClick: () => setActiveTab('tasks') },
    { icon: <Camera className="w-5 h-5" />, label: t('submit_proof'), active: activeTab === 'proof', onClick: () => setActiveTab('proof') },
    { icon: <CheckCircle className="w-5 h-5" />, label: t('attendance'), active: activeTab === 'attendance', onClick: () => setActiveTab('attendance') },
    { icon: <QrCode className="w-5 h-5" />, label: t('digital_id'), active: activeTab === 'digitalid', onClick: () => setActiveTab('digitalid') },
    { icon: <GraduationCap className="w-5 h-5" />, label: t('training'), active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), active: activeTab === 'settings', onClick: () => setActiveTab('settings') },
    { icon: <UserCircle className="w-5 h-5" />, label: t('profile'), active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
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
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Submit Proof of Work</h2>
              <p className="text-gray-500">Verify your task completion with geo-tagged photos</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Task Context & Requirements (Desktop) / Top (Mobile) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Active Task Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ClipboardList className="w-24 h-24 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 relative z-10">Current Task</h3>

                  <div className="space-y-4 relative z-10">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-gray-900">Main Square - Bin #78</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                        <p className="font-medium text-gray-900 mt-1">Missed Collection</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          High
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Time</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">02:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Card */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Target className="w-4 h-4 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Photo Requirements</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      'Clear view of the cleaned area',
                      'GPS location must be enabled',
                      'Take photos from multiple angles',
                      'Include surrounding context'
                    ].map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Upload Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Proof Photos</h3>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                      {proofPhotos.length}/5 Uploaded
                    </span>
                  </div>

                  {/* Upload Dropzone */}
                  {proofPhotos.length < 5 && (
                    <div className="mb-8">
                      <div className="border-2 border-dashed border-gray-200 hover:border-green-400 rounded-2xl p-8 transition-colors bg-gray-50/50 hover:bg-green-50/30 group text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Camera className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Capture Evidence</h4>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                          Take clear photos of the completed task. Geo-location will be automatically added.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            type="button"
                            onClick={() => proofCameraInputRef.current?.click()}
                            className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md active:scale-95 duration-200"
                          >
                            <Camera className="w-5 h-5" />
                            Open Camera
                          </button>
                          <button
                            type="button"
                            onClick={() => proofGalleryInputRef.current?.click()}
                            className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm hover:shadow-md active:scale-95 duration-200"
                          >
                            <span>🖼️</span>
                            Choose from Gallery
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Photo Grid */}
                  {proofPhotos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4">
                      {proofPhotos.map((p, i) => (
                        <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
                          <img
                            src={p.preview}
                            alt={`Proof ${i + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeProofPhoto(i)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110 shadow-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Location Badge */}
                          <div className="absolute bottom-2 left-2 right-2">
                            {p.geoLoading ? (
                              <div className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span className="font-medium">Acquiring GPS...</span>
                              </div>
                            ) : p.lat ? (
                              <div className="inline-flex items-center gap-1.5 bg-green-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg shadow-sm border border-green-500/50">
                                <MapPin className="w-3 h-3" />
                                <span className="font-medium truncate max-w-[120px]">
                                  {p.lat.toFixed(4)}, {p.lng?.toFixed(4)}
                                </span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 bg-red-500/90 text-white text-xs px-2 py-1 rounded-lg">
                                <X className="w-3 h-3" />
                                <span>No GPS</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hidden Inputs */}
                  <input
                    ref={proofCameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleProofPhotoChange}
                  />
                  <input
                    ref={proofGalleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleProofPhotoChange}
                  />

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all">
                      Save Draft
                    </button>
                    <button
                      className="flex-[2] bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={proofPhotos.length === 0}
                    >
                      Submit Verification ({proofPhotos.filter(p => p.lat).length})
                    </button>
                  </div>
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

      case 'settings': return <SettingsTab />;
      case 'profile':
        return <ProfilePage user={user} />;

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
    <Layout user={user} onLogout={onLogout} sidebarItems={sidebarItems} onProfileClick={() => setActiveTab('profile')}>
      {renderContent()}
    </Layout>
  );
};

export default WorkerDashboard;