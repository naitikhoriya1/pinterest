import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const App = () => {
  return (
    <div>
      <header>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>
      <main>
        <h1>Pinterest Clone</h1>
        <SignedIn>
          {/* Your protected app content goes here */}
          <p>Welcome to your dashboard!</p>
        </SignedIn>
        <SignedOut>
          <p>Please sign in to continue</p>
        </SignedOut>
      </main>
    </div>
  );
};

export default App;
