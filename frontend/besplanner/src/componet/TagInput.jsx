import React, { useState } from 'react'
import { X } from 'lucide-react'

function TagInput({ value, onChange, options, placeholder = "Type and press Enter..." }) {
    const [inputValue, setInputValue] = useState('')
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
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
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {value.map((tag, index) => (
                    <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1.5 rounded-full 
                            bg-purple-500/20 text-purple-300 text-sm font-medium
                            border border-purple-500/20"
                    >
                        {tag}
                        <button 
                            type="button" 
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-purple-400 hover:text-purple-300 
                                focus:outline-none transition-colors duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </span>
                ))}
            </div>
            
            <div className="flex gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-slate-700/50 border border-purple-500/20 
                        rounded-lg px-4 py-3 text-white placeholder-gray-400 
                        focus:outline-none focus:border-purple-500 
                        focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                />
                <select 
                    onChange={handleSelectChange}
                    value=""
                    className="bg-slate-700/50 border border-purple-500/20 
                        rounded-lg px-4 py-3 text-white placeholder-gray-400 
                        focus:outline-none focus:border-purple-500 
                        focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                >
                    <option value="" className="bg-slate-800 text-gray-400">
                        Select from options...
                    </option>
                    {options
                        .filter(option => !value.includes(option))
                        .map((option, index) => (
                            <option 
                                key={index} 
                                value={option}
                                className="bg-slate-800 text-white"
                            >
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