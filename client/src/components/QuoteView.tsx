import React from 'react';

export default function QuoteView() {
    // Placeholder for where you would calculate the insurance quote
    const quote = Math.random() * 1000; // Replace this with actual quote calculation

    return (
        <div>
            <h4>Your Insurance Quote</h4>
            <p>${quote.toFixed(2)}</p>
        </div>
    );
}
