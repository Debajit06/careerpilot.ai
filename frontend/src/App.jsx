import { Routes, Route } from "react-router-dom";
import Register from "./feature/auth/pages/register";
import Login from "./feature/auth/pages/login";
import { AuthProvider } from "./feature/auth/auth.context.jsx";
import Home from "./feature/interview/pages/Home.jsx";
import Interview from "./feature/interview/pages/Interview.jsx";
import { InterviewProvider } from "./feature/interview/interview.context.jsx"



 function App() {
    return (
      <AuthProvider>
        <InterviewProvider>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/interview/:interviewId" element={<Interview/>} />
        </Routes>
        </InterviewProvider>
    </AuthProvider>
    
  );
}

export default App;