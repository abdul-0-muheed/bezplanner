import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getuid } from './getuid';

function Tax() {
    const [taxData, setTaxData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const uid = getuid()
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

    if (isLoading) {
        return <div>Loading tax plan...</div>;
    }

    return (
        <div>
            {taxData && (
                <ul>
                    {taxData.map((tax, index) => (
                        <li key={index}>{tax} <br></br><br></br></li>
                    ))}
                </ul>
            )}
            {!taxData && !isLoading && <p>No tax data found.</p>}

        </div>
    );
}
export default Tax;
