import React from 'react';
import HeatMap from '../../common/HeatMap';

const HeatMapTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Area Heat Maps</h2>
                <p className="text-gray-600">Monitor cleanliness trends in your administrative area</p>
            </div>
            <HeatMap />
        </div>
    );
};

export default HeatMapTab;
