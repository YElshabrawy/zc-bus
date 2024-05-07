'use client';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';

function LoginBtn() {
    // if (session && session.user) {
    //     return <Button onClick={() => signOut()}>Sign out</Button>;
    // }
    return <Button onClick={() => signIn()}>Log in</Button>;
}

export default LoginBtn;
