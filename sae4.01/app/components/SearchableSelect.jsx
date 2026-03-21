'use client';

import { useState } from 'react';
import '../css/SearchableSelect.css';

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    getOptionValue,
    getOptionLabel,
    placeholder = "Choisir..."
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(
        (option) => String(getOptionValue(option)) === String(value)
    );

    return (
        <div className="searchable-select">
            <input
                type="text"
                value={open ? search : (selectedOption ? getOptionLabel(selectedOption) : "")}
                placeholder={placeholder}
                onFocus={() => {
                    setOpen(true);
                    setSearch("");
                }}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onBlur={() => {
                    setTimeout(() => setOpen(false), 150);
                }}
            />

            {open && (
                <div className="searchable-select-dropdown">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={getOptionValue(option)}
                                className="searchable-select-option"
                                onMouseDown={() => {
                                    onChange(getOptionValue(option));
                                    setSearch("");
                                    setOpen(false);
                                }}
                            >
                                {getOptionLabel(option)}
                            </div>
                        ))
                    ) : (
                        <div className="searchable-select-empty">
                            Aucun résultat
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}