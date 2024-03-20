import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import QuoteView from './components/QuoteView';
import Application from './components/Application';
import StartApplicationButton from './components/StartApplicationButton';

function App() {
    const [quoteValue, setQuoteValue] = useState<number>(0);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartApplicationButton />} />
                <Route
                    path="/applications/:id"
                    element={<Application setQuoteValue={setQuoteValue} />}
                />
                <Route path="/quote" element={<QuoteView value={quoteValue} />} />
                {/* <Route path="*" element={<Navigate replace to="/" />} />
                 *****Comment out for now from DEV as it was sometimes rerouting to fallback before it could resolve to above paths*****
                 */}
            </Routes>
        </Router>
    );
}

export default App;
