

// import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import DrawingApp from './DrawingApp';
// import Result from './Result';
// import DisplayPage from "./DisplayPage";
// import { ImageProvider } from "./ImageContext"; // Import the ImageProvider

// const App = () => {


//     return (
//         <ImageProvider>
//         <Router>
//             <Routes>
//                 <Route path="/" element={<DrawingApp />} />
//                 <Route path="/result" element={<Result />} />
//                 <Route path="/display" element={<DisplayPage />} />
//             </Routes>
//         </Router>
//         </ImageProvider>
//     );
// };

// export default App;




// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import DrawingApp from './DrawingApp';
// import Result from './Result';
// import DisplayPage from "./DisplayPage";
// import { ImageProvider } from "./ImageContext"; // Import the ImageProvider
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"; // Import Clerk components

// const App = () => {
//     return (
//         <ImageProvider>
//             <Router>
//                 <header >
//                     <SignedOut>
//                         <SignInButton />
//                     </SignedOut>
//                     <SignedIn className="sign-in-out">
//                         <UserButton />
//                     </SignedIn>
//                 </header>
//                 <Routes>
//                     <Route path="/" element={<DrawingApp />} />
//                     <Route path="/result" element={<Result />} />
//                     <Route path="/display" element={<DisplayPage />} />
//                 </Routes>
//             </Router>
//         </ImageProvider>
//     );
// };

// export default App;






// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import DrawingApp from './DrawingApp';
// import Result from './Result';
// import DisplayPage from "./DisplayPage";
// import { ImageProvider } from "./ImageContext"; // Import the ImageProvider
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"; // Import Clerk components

// const App = () => {
//     return (
//         <ImageProvider>
//             <Router>
//                 <header>
//                     <SignedOut>
//                         <SignInButton />
//                     </SignedOut>
//                     <SignedIn>
//                         <UserButton />
//                     </SignedIn>
//                 </header>
//                 <Routes>
//                     <Route
//                         path="/"
//                         element={
//                             <SignedIn>
//                                 <DrawingApp />
//                             </SignedIn>
//                         }
//                     />
//                     <Route
//                         path="/result"
//                         element={
//                             <SignedIn>
//                                 <Result />
//                             </SignedIn>
//                         }
//                     />
//                     <Route
//                         path="/display"
//                         element={
//                             <SignedIn>
//                                 <DisplayPage />
//                             </SignedIn>
//                         }
//                     />
//                     {/* Optional: Add a fallback route for signed-out users */}
//                     <Route
//                         path="*"
//                         element={<div>Please sign in to access this content.</div>}
//                     />
//                 </Routes>
//             </Router>
//         </ImageProvider>
//     );
// };

// export default App;








// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import DrawingApp from './DrawingApp';
// import Result from './Result';
// import DisplayPage from "./DisplayPage";
// import { ImageProvider } from "./ImageContext"; // Import the ImageProvider
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"; // Import Clerk components

// const App = () => {
//     return (
//         <ImageProvider>
//             <Router>
//                 <header>
//                     <SignedOut>
//                         <div className="sign-in-container">
//                             <h1>Welcome to Our Application</h1>
//                             <SignInButton className="sign-in-button" />
//                         </div>
//                     </SignedOut>
//                     <SignedIn>
//                         <UserButton />
//                     </SignedIn>
//                 </header>
//                 <Routes>
//                     <Route
//                         path="/"
//                         element={
//                             <SignedIn>
//                                 <DrawingApp />
//                             </SignedIn>
//                         }
//                     />
//                     <Route
//                         path="/result"
//                         element={
//                             <SignedIn>
//                                 <Result />
//                             </SignedIn>
//                         }
//                     />
//                     <Route
//                         path="/display"
//                         element={
//                             <SignedIn>
//                                 <DisplayPage />
//                             </SignedIn>
//                         }
//                     />
//                     {/* Optional: Add a fallback route for signed-out users */}
//                     <Route
//                         path="*"
//                         element={<div>Please sign in to access this content.</div>}
//                     />
//                 </Routes>
//             </Router>
//         </ImageProvider>
//     );
// };

// export default App;




import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DrawingApp from './DrawingApp';
import Result from './Result';
import DisplayPage from "./DisplayPage";
import { ImageProvider } from "./ImageContext"; // Import the ImageProvider
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"; // Import Clerk components
import { SignIn } from "@clerk/clerk-react"; // Import SignIn component

const App = () => {
    const [usesLeft, setUsesLeft] = useState(3);

    // Check local storage for the usage count on initial load
    useEffect(() => {
        const storedUses = localStorage.getItem("usesLeft");
        if (storedUses) {
            setUsesLeft(Number(storedUses));
        }
    }, []);

    // Save usage count to local storage when it changes
    useEffect(() => {
        localStorage.setItem("usesLeft", usesLeft);
    }, [usesLeft]);

    const decrementUsage = () => {
        if (usesLeft > 0) {
            setUsesLeft(usesLeft - 1);
        }
    };

    return (
        <ImageProvider>
            <Router>
                {/* <header>
                    <SignedOut>
                        <div className="sign-in-container">
                            <SignIn />
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </header> */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            // <SignedIn>
                                // {usesLeft > 0 ? (
                                    // <DrawingApp onUse={decrementUsage} />
                                // ) : (
                                    // <div>You have used up your access.</div>
                                // )}
                            // </SignedIn>
                            <DrawingApp onUse={decrementUsage} />
                        }
                    />
                    <Route
                        path="/result"
                        element={
                            // // <SignedIn>
                            //     // {usesLeft > 0 ? (
                            //         <Result onUse={decrementUsage} />
                            //     ) : (
                            //         <div>You have used up your access.</div>
                            //     )}
                            // </SignedIn>
                            <Result onUse={decrementUsage} />
                        }
                    />
                    <Route
                        path="/display"
                        element={
                            // <SignedIn>
                                // {usesLeft > 0 ? (
                                    <DisplayPage onUse={decrementUsage} />
                                // ) : (
                                    // <div>You have used up your access.</div>
                                // )}
                            // </SignedIn>
                        }
                    />
                </Routes>
            </Router>
        </ImageProvider>
    );
};

export default App;
