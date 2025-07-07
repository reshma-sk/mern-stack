import  { useState } from 'react'
import { checkValidData } from '../utils/validate';
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';


const Login = () => {
  const [isSignin, setIsSignin] = useState(true);
  const[fullName,setFullName] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[errorMessage,setErrorMessage] = useState(null)
  const navigate = useNavigate();

  const toglleForm = ()=>{
    setIsSignin(!isSignin)  
  }

  const handlePrevent = async ()=>{
    const message = checkValidData(fullName,email,password)
    setErrorMessage(message)
    if(message) return

    if(isSignin){
      try {
        const loginRes = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/customers/login`,{
          method:"post",
          headers:{'Content-type':'application/json'},
          body:JSON.stringify({email,password}),
          credentials: "include", // ✅ important for cookies
        })
        
        if (!loginRes.ok) {
          const errorData = await loginRes.json();
          setErrorMessage(errorData?.message || 'Login failed');
          return;
        }
        
        const response = await loginRes.json();
        //console.log(response);
        const accessToken = response.accessToken
        const customer = response.customer
        if (accessToken && customer) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("customer", JSON.stringify(customer));

          alert("Loggedin successfully");
          if (customer.role !== "user") {
            alert("admin");
          } else {
            navigate("/users");
          }
        }
        else{
          alert('Login Failed')
        }
      } catch (error) {
        console.log(error);
        setErrorMessage('Login failed, please try again')
      }  
    }
    else{
      try {
        const signupResponse =  await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/customers`,{
          method:'POST',
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            fullName,
            email,
            password,
          }),
        })
        const data = await signupResponse.json()
        if (!data.error) {
          toast.success('Signup successful!');
        } else {
          toast.error(data.error);
        }
        // Optionally reset fields:
        setFullName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.log(error);
        toast.error('Signup failed, please try again.');
        setErrorMessage('Signup failed, please try again')  
      }

    }
    
  }
  return (
    <>
      <form type="submit" onSubmit={(e) => e.preventDefault()}>
        <h1>{!isSignin ? "Signup" : "Signin"}</h1>
        {!isSignin && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="enter your name"
          />
        )}
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
          />
        </div>
        <p>{errorMessage}</p>
        <button onClick={handlePrevent}>
          {!isSignin ? "signup" : " signin"}
        </button>
        <p style={{ cursor: "pointer" }} onClick={toglleForm}>
          {isSignin ? "new, register" : "already member,login"}
        </p>
      </form>
    </>
  );
};

export default Login;