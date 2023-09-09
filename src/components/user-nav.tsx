import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function UserNav() {
  return (
    <>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              // userButtonAvatarBox: {
              //   width: 56,
              //   height: 56,
              // },
            },
          }}
        />
      </SignedIn>
    </>
  );
}
