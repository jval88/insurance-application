import React from 'react';
import { QuoteViewProps } from '../types/types';

export default function QuoteView({ value }: QuoteViewProps) {
    return (
        <div>
            <h4>Your Insurance Quote</h4>
            <p>${value.toFixed(2)}</p>
        </div>
    );
}
