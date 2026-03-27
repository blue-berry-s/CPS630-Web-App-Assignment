import { useState } from "react";
import Button from "../../components/Button/Button";
import "../../css/defaultStyle.css"
import "./Login.css"; 



function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded correct credentials
  const correctEmail = "student@torontomu.ca";
  const correctPassword = "password123";

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // Check credentials
    if (email === correctEmail && password === correctPassword) {
      setError("");
      setPage("home"); // redirect to Home.jsx
    } else {
      setError("Invalid email or password");
    }
  };


 return (
     <div className="flex justify-center items-center min-h-screen "
     style={{ display:'flex', justifyContent:'center' }}>
       <div className="login-card flex justify-center">
        
         {/* TMU Logo */}
         <img
           src="/src/assets/logos/TMU.jpg"
           alt="TMU Logo"
           className="logo mb-10 object-contain"
         />


         {/* Login Form */}
         <form
           onSubmit={handleSubmit}
           className="flex flex-col items-center space-y-5 w-full"
         >
           <div className="input-box flex flex-col p-5 rounded-lg space-y-5">
             <input
               id="email"
               name="email"
               type="email"
               placeholder="yourname@torontomu.ca"
               className="input-field"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />


             <input
               id="password"
               name="password"
               type="password"
               placeholder="********"
               className="input-field"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           </div>


           <p id="error" className="text-red-600 text-sm hidden"></p>


           <div className="flex justify-start w-full px-6">
             <Button
               buttonType="login-btn text-white py-3 rounded-md"
               text="Log In"
             />
           </div>
         </form>


         {/* Forgot Password */}
         <p className="mt-4 px-6 text-end text-gray-600 text-sm">
           Forgot your password?{" "}
           <a href="#" className="text-blue-600 hover:underline">
             Reset
           </a>
         </p>
       </div>
     </div>
 );
}


export default Login;