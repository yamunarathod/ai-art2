import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <SignIn 
      path="/sign-in" 
      routing="path" 
      signUpUrl="/sign-up" 
    
      // Additional configuration as needed
    />
  );
}

export default SignInPage;
