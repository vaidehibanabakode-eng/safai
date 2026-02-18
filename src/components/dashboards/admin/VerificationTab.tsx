import React from 'react';
import { Camera, CheckCircle, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import StatCard from '../../common/StatCard';

const VerificationTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Verification</h2>
                <p className="text-gray-600">Review and verify worker task completions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Verifications"
                    value="23"
                    icon={<Camera className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Verified Today"
                    value="45"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "8", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Rejected"
                    value="3"
                    icon={<AlertCircle className="w-6 h-6" />}
                    color="red"
                />
                <StatCard
                    title="Verification Rate"
                    value="94%"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "2%", isPositive: true }}
                    color="blue"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Work Submissions</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {[
                            {
                                id: 'W001',
                                worker: 'John Worker',
                                task: 'Cleaned overflowing bin at MG Road',
                                location: 'MG Road, Sector 15',
                                submittedAt: '2 hours ago',
                                hasPhoto: true,
                                hasGeoTag: true
                            },
                            {
                                id: 'W002',
                                worker: 'Sarah Cleaner',
                                task: 'Removed illegal dumping',
                                location: 'Park Street, Area 12',
                                submittedAt: '4 hours ago',
                                hasPhoto: true,
                                hasGeoTag: true
                            }
                        ].map((submission, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold text-gray-900">{submission.id}</span>
                                            {submission.hasGeoTag && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                    Geo-tagged
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">{submission.task}</h4>
                                        <p className="text-gray-600 mb-2">Worker: {submission.worker}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {submission.location}
                                            </span>
                                            <span>Submitted {submission.submittedAt}</span>
                                        </div>
                                    </div>
                                    {submission.hasPhoto && (
                                        <div className="ml-4">
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Camera className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-xs text-gray-500 text-center mt-1">Photo evidence</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
                                        ✓ Approve
                                    </button>
                                    <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors">
                                        ✗ Reject
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationTab;
