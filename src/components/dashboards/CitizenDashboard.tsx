import React, { useState, useRef } from 'react';
import {
  ClipboardList,
  Calendar,
  GraduationCap,
  Camera,
  Clock,
  CheckCircle,
  Star,
  Mic,
  MicOff,
  Volume2,
  MapPin,
  X,
  Loader2,
  UserCircle,
  LayoutDashboard,
  AlertTriangle,
  History,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import StatCard from '../common/StatCard';
import TrainingSystem from '../training/TrainingSystem';
import ProfilePage from '../common/ProfilePage';
import { useLanguage } from '../../contexts/LanguageContext';
import SettingsTab from './tabs/SettingsTab';


interface CitizenDashboardProps {
  user: User;
  onLogout: () => void;
}

// Self-contained Speech Recognition type shim (avoids needing @types/dom-speech-recognition)
interface ISpeechRecognitionResult { readonly length: number;[index: number]: { transcript: string } }
interface ISpeechRecognitionEvent { readonly results: ISpeechRecognitionResult[] }
interface ISpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home'); // Changed default to 'home' to match new key
  const [isListening, setIsListening] = useState(false);
  const [description, setDescription] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { t, language } = useLanguage();

  // ----------- Multi-photo state -----------
  interface GeoPhoto {
    file: File;
    preview: string;
    lat?: number;
    lng?: number;
    address?: string;
    geoLoading?: boolean;
  }
  const [photos, setPhotos] = useState<GeoPhoto[]>([]);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Capture GPS coords silently when a photo is added
  const captureGpsForPhoto = (index: number) => {
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
        } catch { /* fallback to coords */ }
        setPhotos((prev) =>
          prev.map((p, i) =>
            i === index
              ? { ...p, lat: coords.latitude, lng: coords.longitude, address, geoLoading: false }
              : p
          )
        );
      },
      () => {
        // GPS denied — mark as done without coords
        setPhotos((prev) =>
          prev.map((p, i) => (i === index ? { ...p, geoLoading: false } : p))
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const startIndex = photos.length;
    const toAdd: GeoPhoto[] = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      geoLoading: true,
    }));
    setPhotos((prev) => [...prev, ...toAdd]);
    // Capture GPS for each new photo
    toAdd.forEach((_, i) => captureGpsForPhoto(startIndex + i));
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ----------- GPS location state -----------
  const [location, setLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          setLocation(data.display_name || `${coords.latitude}, ${coords.longitude}`);
        } catch {
          setLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        alert('Unable to fetch location. Please allow location access.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ----------- Voice – Microphone for Report Issue -----------
  const toggleMic = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang =
      language === 'ur' ? 'ur-PK' : language === 'sd' ? 'sd' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results
        .map((r) => r[0].transcript)
        .join('');
      setDescription(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ----------- Voice – Read Aloud for Dashboard summary -----------
  const readAloud = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const summary =
      language === 'ur'
        ? `آپ نے 12 رپورٹیں جمع کی ہیں۔ 10 مسائل حل ہوچکے ہیں۔ ٹریننگ پروگریس 75 فیصد ہے۔`
        : language === 'sd'
          ? `توهان 12 رپورٽون جمع ڪيون آهن. 10 مسئلا حل ٿيا آهن. ٽريننگ پروگريس 75 سيڪڙو آهي.`
          : `You have submitted 12 reports. 10 issues have been resolved. Training progress is at 75 percent.`;

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang =
      language === 'ur' ? 'ur-PK' : language === 'sd' ? 'sd' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const sidebarItems = [
    { icon: <GraduationCap className="w-5 h-5" />, label: t('nav_education'), active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav_home'), active: activeTab === 'home', onClick: () => setActiveTab('home') },
    { icon: <AlertTriangle className="w-5 h-5" />, label: t('nav_report'), active: activeTab === 'report', onClick: () => setActiveTab('report') },
    { icon: <History className="w-5 h-5" />, label: t('nav_track'), active: activeTab === 'track', onClick: () => setActiveTab('track') },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), active: activeTab === 'settings', onClick: () => setActiveTab('settings') },
    { icon: <UserCircle className="w-5 h-5" />, label: t('profile'), active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{t('citizen_dashboard_title')}</h2>
                <p className="text-gray-600">{t('citizen_dashboard_subtitle')}</p>
              </div>
              <button
                onClick={readAloud}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                title={t('read_aloud')}
              >
                <Volume2 className="w-4 h-4" />
                {t('read_aloud')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title={t('stat_reports')}
                value="12"
                icon={<ClipboardList className="w-6 h-6" />}
                trend={{ value: '2', isPositive: true }}
                color="blue"
              />
              <StatCard
                title={t('stat_resolved')}
                value="10"
                icon={<Star className="w-6 h-6" />}
                trend={{ value: '1', isPositive: true }}
                color="green"
              />
              <StatCard
                title={t('stat_training')}
                value="75%"
                icon={<GraduationCap className="w-6 h-6" />}
                trend={{ value: '25%', isPositive: true }}
                color="yellow"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{t('recent_reports')}</h3>
                <button
                  onClick={() => setActiveTab('track')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'R001', issue: 'Overflowing bin near park', status: 'Resolved', date: '2 days ago' },
                  { id: 'R002', issue: 'Missed garbage collection', status: 'In Progress', date: '1 day ago' },
                  { id: 'R003', issue: 'Illegal dumping on street', status: 'Pending', date: '3 hours ago' },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{report.issue}</p>
                      <p className="text-sm text-gray-500">{report.id} • {report.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('area_score_title')}</h3>
                  <p className="text-blue-100">{t('area_performing_well')}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">8.5/10</div>
                  <div className="text-blue-100">{t('this_week')}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('report_title')}</h2>
              <p className="text-gray-600">{t('report_subtitle')}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('issue_type')}
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200">
                    <option value="">{t('select_issue_type')}</option>
                    <option value="overflowing">{t('overflowing_bin')}</option>
                    <option value="missed">{t('missed_collection')}</option>
                    <option value="illegal">{t('illegal_dumping')}</option>
                    <option value="damaged">{t('damaged_bin')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('location')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                      placeholder={t('location_placeholder')}
                    />
                    <button
                      type="button"
                      onClick={fetchLocation}
                      disabled={locationLoading}
                      title="Use my current location"
                      className="flex items-center gap-2 px-4 py-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-60"
                    >
                      {locationLoading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <MapPin className="w-5 h-5" />}
                      <span className="text-sm font-medium hidden sm:inline">
                        {locationLoading ? 'Fetching…' : 'Auto-detect'}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('description')}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 pr-14 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                      placeholder={t('description_placeholder')}
                    />
                    {/* Microphone button */}
                    <button
                      type="button"
                      onClick={toggleMic}
                      title={isListening ? t('listening') : t('speak_description')}
                      className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${isListening
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                        }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  {isListening && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                      {t('listening')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('photo_evidence')}
                    <span className="ml-2 text-xs font-normal text-gray-400">({photos.length}/5)</span>
                  </label>

                  {/* Photo preview grid */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                      {photos.map((p, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={p.preview}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {/* Geo-tag badge */}
                          {p.geoLoading ? (
                            <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/60 text-white text-[9px] font-medium px-1 py-0.5 rounded">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              <span>GPS…</span>
                            </div>
                          ) : p.lat ? (
                            <div
                              className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-green-600/90 text-white text-[9px] font-medium px-1 py-0.5 rounded cursor-help max-w-[95%] overflow-hidden"
                              title={p.address || `${p.lat?.toFixed(5)}, ${p.lng?.toFixed(5)}`}
                            >
                              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">{p.lat.toFixed(4)}, {p.lng?.toFixed(4)}</span>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload buttons */}
                  {photos.length < 5 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">{t('take_photo')}</p>
                      <p className="text-xs text-gray-400 mb-4">Each photo is automatically geo-tagged with your GPS location</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <Camera className="w-4 h-4" />
                          Camera
                        </button>
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <span>🖼️</span>
                          Gallery
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Camera input – one photo at a time from camera */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {/* Gallery input – multiple photos from library */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    {t('save_draft')}
                  </button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200">
                    {t('submit_report')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'track':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('nav_track')}</h2>
              <p className="text-gray-600">Monitor the status of your reported issues</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Your Reports</h3>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">10 Resolved</span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">2 In Progress</span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { id: 'R001', issue: 'Overflowing bin near park', status: 'Resolved', date: '2 days ago', location: 'Central Park West Gate' },
                  { id: 'R002', issue: 'Missed garbage collection', status: 'In Progress', date: '1 day ago', location: '12 Market Street' },
                  { id: 'R003', issue: 'Illegal dumping on street', status: 'Pending', date: '3 hours ago', location: 'Industrial Area Zone 4' },
                  { id: 'R004', issue: 'Damaged street bin', status: 'Resolved', date: '1 week ago', location: 'Main Square' },
                  { id: 'R005', issue: 'Hazardous waste found', status: 'Resolved', date: '2 weeks ago', location: 'River Bank' },
                ].map((report, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${report.status === 'Resolved' ? 'bg-green-100 text-green-600' : report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                        {report.status === 'Resolved' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{report.issue}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="font-medium">#{report.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${report.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {report.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('coming_soon')}</h3>
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

export default CitizenDashboard;