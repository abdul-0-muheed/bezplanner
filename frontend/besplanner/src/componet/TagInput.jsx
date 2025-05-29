import React, { useState } from 'react'

function TagInput({ value, onChange, options, placeholder = "Type and press Enter..." }) {
    const [inputValue, setInputValue] = useState('')
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
            // Remove the options.includes check to allow custom values
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()])
            }
            setInputValue('')
        }
    }

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value
        if (selectedValue && !value.includes(selectedValue)) {
            onChange([...value, selectedValue])
            setInputValue('')
        }
    }

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove))
    }
  
    return (
        <div className="tag-input-container">
            <div className="tag-list">
                {value.map((tag, index) => (
                    <span key={index} className="tag">
                        {tag}
                        <button 
                            type="button" 
                            className="tag-remove"
                            onClick={() => removeTag(tag)}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                <select 
                    onChange={handleSelectChange}
                    value=""
                >
                    <option value="">Select from options...</option>
                    {options
                        .filter(option => !value.includes(option))
                        .map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

export default TagInput