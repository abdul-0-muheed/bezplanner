import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './sign-up'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import question from '../assets/question.json'
import businessbase from '../assets/businessbase.json'
import TagInput from '../componet/TagInput'
import { getuid } from './getuid'
import axios from 'axios'

function Onboarding() {
    const navigate = useNavigate()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [formData, setFormData] = useState(businessbase)
    const [currentpage, setCurrentpage] = useState(question.pages[0])
    const userId = getuid()

    // Check if the user is logged in
    const checkUserLogin = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            navigate('/signup')  // Redirect to sign-in page if not logged in
        }
    }

    // Run the login check on component mount
    useEffect(() => {
        checkUserLogin()
    }, [])

    // Updates the current page whenever the question number changes
    useEffect(() => {
        setCurrentpage(question.pages[currentQuestion])
    }, [currentQuestion])

    // Handles changes to any input field
    const handleInputChange = (questionId, value, jsonPath) => {
        // Deep clone the form data to avoid state mutation
        const newFormData = JSON.parse(JSON.stringify(formData))
        
        // Convert dot notation path to nested object references
        // Example: "business_info.country" -> formData.business_info.country
        const keys = jsonPath.split('.')
        let current = newFormData
        
        // Navigate to the correct nested object
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]]
        }
        
        // Update the value at the specified path
        current[keys[keys.length - 1]] = value
        setFormData(newFormData)
    }

    // Transforms form data into API-compatible format
    const transformFormDataForAPI = (data) => {
        
        
        // Convert the nested form data into the format expected by the backend
        return {
            uid: userId,  // TODO: Replace with actual user ID
            no_business : 1,
            country: data.business_info.country,
            state: data.business_info.state,
            city: data.business_info.city,
            business_idea: data.business_info.business_idea,
            ownership_structure: data.business_info.ownership_structure,
            sales_model: data.business_info.sales_mode, // Note: field name differs
            hire_employees: {
                answer: data.business_info.hire_employees.answer,
                number_of_employees: data.business_info.hire_employees.number_of_employees,
                type: data.business_info.hire_employees.type
            },
            expected_annual_revenue: parseFloat(data.business_info.expected_annual_revenue_inr),
            expected_annual_expenses: parseFloat(data.business_info.expected_annual_expenses_inr),
            expected_capital_source: data.business_info.startup_capital_source,
            owner_pay_style: data.business_info.owner_pay_style,
            buy_assets: {
                answer: data.business_info.buy_assets_or_equipment.answer,
                things: data.business_info.buy_assets_or_equipment.examples
            },
            sell_internationally: {
                answer: data.business_info.sell_internationally,
                countries: [] // Add this field to your form if needed
            },
            tax_priorities: data.business_info.tax_priority || []
        }
    }

    // Validates the current page's required fields
    const validateCurrentPage = () => {
        // Filter questions that are required and their dependencies are met
        const requiredQuestions = currentpage.questions.filter(q => {
            if (!q.required) return false
            
            // Handle conditional requirements (e.g., show only if another question was answered "yes")
            if (q.dependsOn) {
                const dependentValue = getValueFromPath(
                    formData, 
                    currentpage.questions.find(dq => dq.id === q.dependsOn.question)?.jsonPath
                )
                return dependentValue === q.dependsOn.value
            }
            return true
        })
        
        // If no required questions, validation passes
        if (requiredQuestions.length === 0) return true
        
        // Check each required question for valid input
        for (const question of requiredQuestions) {
            const value = getValueFromPath(formData, question.jsonPath)
            
            // Check for various types of empty values
            const isEmpty = 
                value === undefined || 
                value === null || 
                value === '' || 
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'number' && isNaN(value))
                
            if (isEmpty) return false
        }
        return true
    }

    // Handles the "Next" button click
    const handleNext = async () => {
        // First validate the current page
        if (!validateCurrentPage()) {
            // Show which fields are missing
            const requiredQuestions = currentpage.questions.filter(q => {
                if (!q.required) return false
                if (q.dependsOn) {
                    const dependentValue = getValueFromPath(
                        formData, 
                        currentpage.questions.find(dq => dq.id === q.dependsOn.question)?.jsonPath
                    )
                    return dependentValue === q.dependsOn.value
                }
                return true
            })
            
            const emptyFields = requiredQuestions
                .filter(q => {
                    const value = getValueFromPath(formData, q.jsonPath)
                    return !value || 
                        (Array.isArray(value) && value.length === 0) || 
                        value === '' || 
                        value === null || 
                        value === undefined
                })
                .map(q => q.label)
                .join(', ')
                
            if (emptyFields) {
                // alert(`Please fill in the following required fields: ${emptyFields}`);
            }
            return
        }

        // If not on the last page, go to next page
        if (currentQuestion < question.pages.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            // On last page, submit the form
            try {
                const apiData = transformFormDataForAPI(formData)
                // TODO: Implement API call
                try {
                    // const response = await axios.post(`http://127.0.0.1:8000/businnesdata/${userId}/1`, apiData);
                    const response = await axios.post(`https://guild-to-business.onrender.com/businnesdata/${userId}/1`, apiData);
                    console.log('Response data:', response.data);
                } catch (error) {
                    console.error('Error:', error);
                }


                console.log('Business created:', apiData)
                localStorage.setItem('businessData', JSON.stringify(formData))
                navigate('/tax')
              } catch (error) {
                console.error('Error creating business:', error)
                alert('Error creating business. Please try again.')
            }
        }
    }

    // Handles the "Back" button click
    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1)
        }
    }

    // Renders different types of input fields based on question type
    const renderInput = (question) => {
        const baseInputStyles = `
            w-full bg-slate-700/50 border border-purple-500/20 rounded-lg px-4 py-3 
            text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
            focus:ring-1 focus:ring-purple-500 transition-all duration-300
        `

        switch (question.type) {
            case 'text':
            case 'textarea':
                return (
                    <input
                        type="text"
                        className={baseInputStyles}
                        value={getValueFromPath(formData, question.jsonPath) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value, question.jsonPath)}
                        required={question.required}
                        placeholder={`Enter ${question.label.toLowerCase()}`}
                    />
                )
            case 'number':
                return (
                    <input
                        type="number"
                        className={baseInputStyles}
                        value={getValueFromPath(formData, question.jsonPath) || ''}
                        onChange={(e) => handleInputChange(question.id, Number(e.target.value), question.jsonPath)}
                        required={question.required}
                        placeholder={`Enter ${question.label.toLowerCase()}`}
                    />
                )
            case 'boolean':
                return (
                    <select
                        className={baseInputStyles}
                        value={getValueFromPath(formData, question.jsonPath) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value === 'true', question.jsonPath)}
                        required={question.required}
                    >
                        <option value="">Select...</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                )
            case 'select':
                return (
                    <select
                        className={baseInputStyles}
                        value={getValueFromPath(formData, question.jsonPath) || ''}
                        onChange={(e) => handleInputChange(question.id, e.target.value, question.jsonPath)}
                        required={question.required}
                    >
                        <option value="">Select...</option>
                        {question.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                )
            case 'multiselect':
                return (
                    <TagInput
                    value={getValueFromPath(formData, question.jsonPath) || []}
                    onChange={(value) => handleInputChange(question.id, value, question.jsonPath)}
                    options={question.options}
                    required={question.required}
                    />
            )
            default:
                return null
        }

    }

    // Helper function to safely access nested object properties
    const getValueFromPath = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    // Component render method
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 mt-10">
                        <h2 className="text-3xl font-bold text-white">
                            {currentpage.title}
                        </h2>
                        <span className="text-purple-400">
                            Step {currentQuestion + 1} of {question.pages.length}
                        </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                            style={{width: `${((currentQuestion + 1) / question.pages.length) * 100}%`}}
                        ></div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-sm">
                    <p className="text-gray-300 mb-8">{currentpage.description}</p>

                    {/* Questions */}
                    <div className="space-y-6">
                        {currentpage.questions.map((q) => (
                            <div key={q.id} className="space-y-2">
                                <label className="block text-white text-lg font-medium mb-2">
                                    {q.label}
                                    {q.required && <span className="text-purple-400 ml-1">*</span>}
                                </label>
                                <div className="relative">
                                    {renderInput(q)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12">
                        <button
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                            className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300
                                ${currentQuestion === 0 
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                                    : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                        
                        <button
                            onClick={handleNext}
                            className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                                text-white rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 
                                transition-all duration-300 transform hover:scale-105"
                        >
                            {currentQuestion === question.pages.length - 1 ? 'Submit' : 'Next'}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper function to safely access nested object properties
const getValueFromPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export default Onboarding