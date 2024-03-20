import React from 'react';

import { QuoteViewProps } from '../types/types';
import GoHomeButton from './GoHomeButton';

export default function QuoteView({ value }: QuoteViewProps) {
    return (
        <div>
            <h4>Your Insurance Quote</h4>
            <p>${value.toFixed(2)}</p>
            <GoHomeButton />
        </div>
    );
}
