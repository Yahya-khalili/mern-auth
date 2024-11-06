import { Navigate, Route, Routes } from "react-router-dom"
import FloatingShape from "./components/FloatingShape"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import EmailVerification from "./pages/EmailVerification"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPasswordPage from "./pages/ResetPasswordPage"



// protected route that require authentification 
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};







//redirect authenticated users to the home page
const RedirectUserAuthenticated = ({children}) => {
  const {  isAuthenticated , user} = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />
  }
  return children

}


function App() {
   const {checkAuth , isCheckingAuth , isAuthenticated , user} = useAuthStore();

  useEffect(()=>{
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />;

  console.log("isAutenticated" , isAuthenticated)
  console.log("user" , user)
  return (
    <div
			className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
		>
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5}/>
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2}/>
      
      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <HomePage/>
          </ProtectedRoute>}></Route>
        <Route path="/Sign-up" element={
          <RedirectUserAuthenticated>
          <SignupPage/>
        </RedirectUserAuthenticated>}></Route>
        <Route path="/Login" element={<RedirectUserAuthenticated>
          <LoginPage/>
        </RedirectUserAuthenticated>}></Route>
        <Route path="/Verify-email" element={<EmailVerification></EmailVerification>}></Route>
        <Route path="/forgot-password" element={<RedirectUserAuthenticated><ForgotPassword></ForgotPassword></RedirectUserAuthenticated>}></Route>
        <Route path="/reset-password/:token" element={<RedirectUserAuthenticated><ResetPasswordPage></ResetPasswordPage></RedirectUserAuthenticated>}></Route>
        
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster></Toaster>
    </div>
  )
}

export default App
