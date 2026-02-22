import React, { useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
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
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation as CapGeolocation } from '@capacitor/geolocation';
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
  const [issueType, setIssueType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { t, language } = useLanguage();

  interface Complaint {
    id: string;
    title: string;
    category: string;
    location: string;
    status: string;
    date: any;
  }
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [complaintToRate, setComplaintToRate] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingNotes, setRatingNotes] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  React.useEffect(() => {
    if (!user) return; // Removed activeTab !== 'track' check so it loads on mount
    setLoadingComplaints(true);
    const q = query(collection(db, 'complaints'), where('citizenId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Complaint[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          title: data.title || data.category || 'Unknown Issue',
          category: data.category || 'General',
          location: data.location || 'Unknown Location',
          status: data.status || 'SUBMITTED',
          date: data.createdAt
        });
      });
      fetched.sort((a, b) => (b.date?.toMillis() || 0) - (a.date?.toMillis() || 0));
      setMyComplaints(fetched);
      setLoadingComplaints(false);
    });
    return () => unsubscribe();
  }, [user, activeTab]);

  // Load training progress for stats
  const [trainingProgress, setTrainingProgress] = useState(0);

  React.useEffect(() => {
    if (!user) return;
    const savedProgress = localStorage.getItem(`training_progress_${user.id}`);
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        // We need total modules to calculate percentage. It's stored in TRAINING_MODULES, but since it depends on the role, we'll assume a standard count or dynamically import.
        // For now, getting length of completed over an assumed total of 4 (from TrainingSystem typical citizen modules). We'll set it dynamically.
        const totalCitizenModules = 4; // Default guess based on TrainingSystem
        const percentage = Math.round((data.completedModules.length / totalCitizenModules) * 100);
        setTrainingProgress(Math.min(percentage, 100)); // Cap at 100
      } catch (e) { console.error("Could not parse training progress", e); }
    }
  }, [user]);

  const handleOpenRating = (complaintId: string) => {
    setComplaintToRate(complaintId);
    setRating(0);
    setRatingNotes('');
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!complaintToRate || rating === 0) return;
    setIsSubmittingRating(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        complaintId: complaintToRate,
        citizenId: user.id,
        rating,
        notes: ratingNotes,
        createdAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'complaints', complaintToRate), {
        status: 'CLOSED',
        updatedAt: serverTimestamp()
      });

      setRatingModalOpen(false);
      setComplaintToRate(null);
    } catch (e) {
      console.error("Error submitting rating", e);
      alert("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

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
  const captureGpsForPhoto = async (index: number) => {
    try {
      let latitude, longitude;

      // Use Native Geolocation if on mobile
      if (Capacitor.isNativePlatform()) {
        const permission = await CapGeolocation.checkPermissions();
        if (permission.location !== 'granted') {
          await CapGeolocation.requestPermissions();
        }
        const position = await CapGeolocation.getCurrentPosition({ enableHighAccuracy: true });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        // Fallback to web HTML5 Geolocation
        if (!navigator.geolocation) throw new Error("No GPS available");
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      let address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        if (data.display_name) address = data.display_name;
      } catch { /* fallback to coords */ }

      setPhotos((prev) =>
        prev.map((p, i) =>
          i === index
            ? { ...p, lat: latitude, lng: longitude, address, geoLoading: false }
            : p
        )
      );
    } catch (e) {
      console.warn("GPS capture failed", e);
      // Mark as done without coords
      setPhotos((prev) =>
        prev.map((p, i) => (i === index ? { ...p, geoLoading: false } : p))
      );
    }
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

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      let latitude, longitude;

      if (Capacitor.isNativePlatform()) {
        const permission = await CapGeolocation.checkPermissions();
        if (permission.location !== 'granted') {
          await CapGeolocation.requestPermissions();
        }
        const position = await CapGeolocation.getCurrentPosition({ enableHighAccuracy: true });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          setLocationLoading(false);
          return;
        }
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        setLocation(data.display_name || `${latitude}, ${longitude}`);
      } catch {
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      }
    } catch (e) {
      console.warn('Unable to fetch location', e);
      alert('Unable to fetch location. Please allow location access.');
    } finally {
      setLocationLoading(false);
    }
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
        ? `آپ نے ${myComplaints.length} رپورٹیں جمع کی ہیں۔ ${myComplaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length} مسائل حل ہوچکے ہیں۔ ٹریننگ پروگریس ${trainingProgress} فیصد ہے۔`
        : language === 'sd'
          ? `توهان ${myComplaints.length} رپورٽون جمع ڪيون آهن. ${myComplaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length} مسئلا حل ٿيا آهن. ٽريننگ پروگريس ${trainingProgress} سيڪڙو آهي.`
          : `You have submitted ${myComplaints.length} reports. ${myComplaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length} issues have been resolved. Training progress is at ${trainingProgress} percent.`;

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang =
      language === 'ur' ? 'ur-PK' : language === 'sd' ? 'sd' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!issueType) {
      setSubmitError('Please select an issue type.');
      return;
    }
    if (!location) {
      setSubmitError('Please provide a location.');
      return;
    }
    if (!description.trim()) {
      setSubmitError('Please provide a description.');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // Only upload the first photo for now to simplify, or join multiple if needed. 
      // The schema currently supports a single imageUrl, so we take the first.
      if (photos.length > 0 && photos[0].file) {
        const file = photos[0].file;
        const fileRef = ref(storage, `complaints/${user.id}_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      const complaintData = {
        title: issueType,
        description: description.trim(),
        category: issueType,
        location: location,
        status: 'SUBMITTED',
        citizenId: user.id,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'complaints'), complaintData);

      setSubmitSuccess('Your complaint has been successfully submitted!');
      // Reset form
      setIssueType('');
      setDescription('');
      setLocation('');
      setPhotos([]);

      // Clear success message after 4s
      setTimeout(() => setSubmitSuccess(''), 4000);

    } catch (err: any) {
      console.error("Error submitting complaint:", err);
      setSubmitError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebarItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav_home'), active: activeTab === 'home', onClick: () => setActiveTab('home') },
    { icon: <GraduationCap className="w-5 h-5" />, label: t('nav_education'), active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <AlertTriangle className="w-5 h-5" />, label: t('nav_report'), active: activeTab === 'report', onClick: () => setActiveTab('report') },
    { icon: <History className="w-5 h-5" />, label: t('nav_track'), active: activeTab === 'track', onClick: () => setActiveTab('track') },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), active: activeTab === 'settings', onClick: () => setActiveTab('settings') },
    { icon: <UserCircle className="w-5 h-5" />, label: t('profile'), active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
  ];

  const renderContent = () => {
    const resolvedCount = myComplaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
    const progressCount = myComplaints.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(c.status)).length;
    const totalReports = myComplaints.length;
    const areaScore = totalReports > 0 ? ((resolvedCount / totalReports) * 10).toFixed(1) : 'N/A';
    const recentReports = myComplaints.slice(0, 3); // Top 3 most recent

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
                value={totalReports.toString()}
                icon={<ClipboardList className="w-6 h-6" />}
                trend={{ value: '2', isPositive: true }}
                color="blue"
              />
              <StatCard
                title={t('stat_resolved')}
                value={resolvedCount.toString()}
                icon={<Star className="w-6 h-6" />}
                trend={{ value: '1', isPositive: true }}
                color="green"
              />
              <StatCard
                title={t('stat_training')}
                value={`${trainingProgress}%`}
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
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1 mr-4 overflow-hidden">
                        <p className="font-medium text-gray-900 truncate">{report.title}</p>
                        <p className="text-sm text-gray-500">{report.id.substring(0, 8)} • {report.date ? new Date(report.date.toMillis()).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${['RESOLVED', 'CLOSED'].includes(report.status)
                        ? 'bg-green-100 text-green-800'
                        : ['ASSIGNED', 'IN_PROGRESS'].includes(report.status)
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No recent reports found.</div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('area_score_title')}</h3>
                  <p className="text-blue-100">{t('area_performing_well')}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{areaScore === 'N/A' ? '--' : `${areaScore}/10`}</div>
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
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="font-medium">{submitSuccess}</p>
                </div>
              )}
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="font-medium">{submitError}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmitReport}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('issue_type')}
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                  >
                    <option value="">{t('select_issue_type')}</option>
                    <option value="Overflowing Bin">{t('overflowing_bin')}</option>
                    <option value="Missed Collection">{t('missed_collection')}</option>
                    <option value="Illegal Dumping">{t('illegal_dumping')}</option>
                    <option value="Damaged Bin">{t('damaged_bin')}</option>
                    <option value="Other">{t('other')}</option>
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
                          onClick={async () => {
                            if (Capacitor.isNativePlatform()) {
                              try {
                                const image = await CapCamera.getPhoto({
                                  quality: 90,
                                  allowEditing: false,
                                  resultType: CameraResultType.Uri,
                                  source: CameraSource.Camera
                                });
                                if (image.webPath) {
                                  const response = await fetch(image.webPath);
                                  const blob = await response.blob();
                                  const file = new File([blob], "camera_photo.jpg", { type: "image/jpeg" });
                                  // Fake an event wrapper to reuse handlePhotoChange logic
                                  const syntheticEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                                  handlePhotoChange(syntheticEvent);
                                }
                              } catch (e) {
                                console.warn('User cancelled photo or error', e);
                              }
                            } else {
                              cameraInputRef.current?.click();
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <Camera className="w-4 h-4" />
                          Camera
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (Capacitor.isNativePlatform()) {
                              try {
                                const image = await CapCamera.getPhoto({
                                  quality: 90,
                                  allowEditing: false,
                                  resultType: CameraResultType.Uri,
                                  source: CameraSource.Photos
                                });
                                if (image.webPath) {
                                  const response = await fetch(image.webPath);
                                  const blob = await response.blob();
                                  const file = new File([blob], "gallery_photo.jpg", { type: "image/jpeg" });
                                  const syntheticEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                                  handlePhotoChange(syntheticEvent);
                                }
                              } catch (e) {
                                console.warn('User cancelled gallery or error', e);
                              }
                            } else {
                              galleryInputRef.current?.click();
                            }
                          }}
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      t('submit_report')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'track':
        return (
          <div className="space-y-8 animate-in fade-in relative">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('nav_track')}</h2>
              <p className="text-gray-600">Monitor the status of your reported issues</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Your Reports</h3>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{resolvedCount} Resolved</span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">{progressCount} In Progress</span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {loadingComplaints ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
                ) : myComplaints.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">You haven't reported any issues yet.</div>
                ) : (
                  myComplaints.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${report.status === 'RESOLVED' || report.status === 'CLOSED' ? 'bg-green-100 text-green-600' :
                          report.status === 'SUBMITTED' ? 'bg-purple-100 text-purple-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                          {report.status === 'RESOLVED' || report.status === 'CLOSED' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{report.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium">#{report.id.slice(0, 8)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date ? new Date(report.date.toMillis()).toLocaleDateString() : 'N/A'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.location.substring(0, 30)}...</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${report.status === 'RESOLVED' || report.status === 'CLOSED' ? 'bg-green-100 text-green-800' :
                          report.status === 'SUBMITTED' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {report.status.replace('_', ' ')}
                        </span>

                        {report.status === 'RESOLVED' && (
                          <button
                            onClick={() => handleOpenRating(report.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                          >
                            Rate & Close
                          </button>
                        )}

                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rating Modal */}
            {ratingModalOpen && complaintToRate && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-emerald-50/50">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Rate Final Work</h3>
                      <p className="text-sm text-gray-500">Your feedback improves our community</p>
                    </div>
                    <button
                      onClick={() => setRatingModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-all duration-200 hover:scale-110 ${rating >= star ? 'text-yellow-400 scale-110 drop-shadow-md' : 'text-gray-200 hover:text-yellow-200'}`}
                        >
                          <Star className="w-12 h-12" fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>

                    <div className="mb-2 flex justify-between text-xs font-semibold text-gray-400 px-2 uppercase tracking-wider">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Feedback (Optional)</label>
                      <textarea
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                        rows={3}
                        placeholder="Tell us what went well or what could be improved..."
                        value={ratingNotes}
                        onChange={(e) => setRatingNotes(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => setRatingModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitRating}
                      disabled={rating === 0 || isSubmittingRating}
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200 transition-all flex items-center gap-2"
                    >
                      {isSubmittingRating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Submit Rating
                    </button>
                  </div>
                </div>
              </div>
            )}
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