import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getuid } from './getuid';
import { useNavigate } from 'react-router-dom';
import { Loader, CheckSquare, Square, ArrowRight, Shield } from 'lucide-react';

function Tax() {
    const [taxData, setTaxData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTaxPlan, setSelectedTaxPlan] = useState([]);
    const uid = getuid();
    const navigate = useNavigate();

    useEffect(() => {
        if (uid){
        const fetchTaxPlan = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/tax_minimalization/${uid}/1`);
                setTaxData(response.data);
            } catch (error) {
                console.error('Error fetching tax plan:', error);
                setTaxData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTaxPlan();
    }
    }, [uid]);

    const handleCheckboxChange = (index) => {
        const newSelectedPlan = [...selectedTaxPlan];
        if (newSelectedPlan.includes(index)) {
            newSelectedPlan.splice(newSelectedPlan.indexOf(index), 1);
        } else {
            newSelectedPlan.push(index);
        }
        setSelectedTaxPlan(newSelectedPlan);
    };


    const handleCreateGuild = async () => {
        try {
            // Prepare the data to send in the POST request
            const selectedTaxPoints = selectedTaxPlan.map(index => taxData?.taxplan?.[index] || ''); //Handle potential nulls
            const postData = {
                selectedTaxPoints,
            };
             console.log( postData); // Log the data being sent for debugging

            // Send the POST request
            await axios.post(`http://127.0.0.1:8000/tax_minimalization/${uid}/1`, postData); // Update the URL as needed

            // Redirect to another page after successful POST request
            navigate('/guild'); // Replace '/success' with the actual path
        } catch (error) {
            console.error('Error creating guild:', error);
            // Handle the error appropriately, e.g., display an error message to the user
            alert('Failed to create guild. Please try again.');
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className="w-12 h-12 text-purple-400 animate-spin" />
                    <p className="text-white text-lg font-medium">Analyzing tax optimization strategies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mt-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6">
                        <Shield className="w-4 h-4 mr-2" />
                        Tax Optimization Strategies
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Choose Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Tax Planning</span> Strategy
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Select the tax optimization strategies that best suit your business needs
                    </p>
                </div>

                {/* Tax Plans Section */}
                <div className="bg-slate-800/50 rounded-2xl border border-purple-500/20 p-8 backdrop-blur-sm">
                    {taxData && (
                        <div className="space-y-4">
                            {taxData['taxplan'].map((tax, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-700/30 transition-all duration-300 cursor-pointer"
                                    onClick={() => handleCheckboxChange(index)}
                                >
                                    <div className="text-purple-400">
                                        {selectedTaxPlan.includes(index) ? (
                                            <CheckSquare className="w-6 h-6" />
                                        ) : (
                                            <Square className="w-6 h-6" />
                                        )}
                                    </div>
                                    <label className="text-gray-300 hover:text-white cursor-pointer flex-grow">
                                        {tax}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {!taxData && !isLoading && (
                        <p className="text-gray-300 text-center">No tax optimization strategies found.</p>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleCreateGuild}
                        disabled={selectedTaxPlan.length === 0}
                        className={`
                            inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 transform
                            ${selectedTaxPlan.length === 0 
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                            }
                        `}
                    >
                        Continue to Next Step
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Tax;
