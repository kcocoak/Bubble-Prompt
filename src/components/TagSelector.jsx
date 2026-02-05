import React from 'react';

/**
 * @file TagSelector.jsx
 * @description A reusable component for selecting multiple tags from a predefined list.
 * Used for selecting styles, industries, or other categorical data.
 * 
 * @module Components/TagSelector
 * @author Feng
 * @date 2026-02-04
 */

/**
 * TagSelector Component.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.type - The type of tag being selected (metadata only, e.g., 'style').
 * @param {Array<string>} props.options - List of available tag strings to display.
 * @param {Array<string>} props.selected - List of currently selected tags.
 * @param {Function} props.onToggle - Callback function when a tag is clicked.
 * format: (tagString) => void
 * @param {boolean} [props.allowCustom=true] - Whether to allow custom tag entry (reserved for future use).
 * 
 * @returns {JSX.Element} The rendered TagSelector component.
 */
const TagSelector = ({ type, options, selected, onToggle, allowCustom = true }) => {
    return (
        <div className="pop-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
            {options.map(opt => {
                const isSelected = selected.includes(opt);
                return (
                    <button
                        key={opt}
                        onClick={() => onToggle(opt)} // Toggles the selection state in parent
                        className={`tag-chip ${isSelected ? 'active' : ''}`}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
};

export default TagSelector;
