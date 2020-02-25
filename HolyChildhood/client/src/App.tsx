import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import './App.css';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import defaultTheme from './Theme';
import Icons from './Icons';
import Main from "./components/layout/Main";

const App: React.FC = () => {
    new Icons();
    return (
        <div>
            <ThemeProvider theme={defaultTheme}>
                <Router>
                    <Header />

                    <Main />

                    <Footer />
                </Router>
            </ThemeProvider>
        </div>
    );
};

export default App;
