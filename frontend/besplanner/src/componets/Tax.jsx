import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getuid } from './getuid';
import { useNavigate } from 'react-router-dom';
import './tax.css'

function Tax() {
    const [taxData, setTaxData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTaxPlan, setSelectedTaxPlan] = useState([]); // State for selected tax plan
    const uid = getuid()
    const navigate = useNavigate(); // Initialize useNavigate

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
        return <div><div className="loader-wrapper">
      <div className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>

      <div id="loader2" className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>

      <div id="loader3" className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>
    </div></div>;
    }

    return (
        <div>
            <div className='taxplan-contioner'>
            {taxData && (
                <ul className='taxplan-ul'>
                    {taxData['taxplan'].map((tax, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox" // Changed to checkbox
                                        name={`taxPlan-${index}`} // Added unique name
                                        value={index}
                                        checked={selectedTaxPlan.includes(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                    {tax}
                                </label>
                            </li>
                        ))}
                </ul>
            )}
            {!taxData && !isLoading && <p>No tax data found.</p>}
            <div className='button-cont'><button onClick={handleCreateGuild} disabled={selectedTaxPlan.length === 0}>
                    Create Guild
                </button>
            </div>
            </div>
        </div>
    );
}
export default Tax;
