import { useState } from "react";
import Button from "../../components/Button/Button";
import "../../css/defaultStyle.css"
import "./Login.css"; 



function Login({ setPage, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", { //  backend endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

if (res.ok) {
  setError("");
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.user._id);
  setUser(data.user); // store user info including role
  

  if (data.user.role === "staff") {
    setPage("home");
  } else {
    setPage("home");
  }
} else {
  setError(data.error || "Login failed");
}
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
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


           {error && <p className="text-red-600 text-sm">{error}</p>}


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