import React from 'react';
import { DollarSign, ShoppingCart, Package, Award } from 'lucide-react';
import StatCard from '../../common/StatCard';

const EcommerceTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">E-commerce Platform</h2>
                <p className="text-gray-600">Revenue from recycled materials and eco-products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹2,45,600"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "15%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Products Sold"
                    value="1,250"
                    icon={<ShoppingCart className="w-6 h-6" />}
                    trend={{ value: "120", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active Listings"
                    value="89"
                    icon={<Package className="w-6 h-6" />}
                    trend={{ value: "8", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Customer Rating"
                    value="4.6/5"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "0.2", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-4">
                        {[
                            { product: 'Recycled Paper Products', sales: '₹45,600', units: 450, growth: '+12%' },
                            { product: 'Compost Fertilizer', sales: '₹38,200', units: 320, growth: '+18%' },
                            { product: 'Eco-friendly Bags', sales: '₹32,800', units: 280, growth: '+8%' },
                            { product: 'Recycled Plastic Items', sales: '₹28,400', units: 240, growth: '+15%' }
                        ].map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{product.product}</p>
                                    <p className="text-sm text-gray-600">{product.units} units sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">{product.sales}</p>
                                    <p className="text-xs text-green-500">{product.growth}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Recycled Materials</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <span className="font-semibold text-green-600">65%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Eco Products</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                                <span className="font-semibold text-blue-600">25%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Services</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                                <span className="font-semibold text-purple-600">10%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcommerceTab;
