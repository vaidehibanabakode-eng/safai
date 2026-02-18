import React from 'react';
import VehicleTracker from '../../common/VehicleTracker';

const VehicleTrackingTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Tracking</h2>
                <p className="text-gray-600">Monitor waste collection vehicles in your area</p>
            </div>
            <VehicleTracker userRole="admin" />
        </div>
    );
};

export default VehicleTrackingTab;
