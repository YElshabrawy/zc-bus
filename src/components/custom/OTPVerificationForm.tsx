import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import axios from '@/lib/axios';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

const OTPFormSchema = z.object({
    pin: z.string().min(4, {
        message: 'Your one-time password must be 4 characters.',
    }),
});

interface OTPVerificationFormProps {
    email: string;
    openOtp: boolean;
    setOpenOtp: React.Dispatch<React.SetStateAction<boolean>>;
}

const OTPVerificationForm = ({
    email,
    openOtp,
    setOpenOtp,
}: OTPVerificationFormProps) => {
    const [resendTimer, setResendTimer] = useState(0);
    const [initialResend, setInitialResend] = useState(true);
    const router = useRouter();
    const otpForm = useForm<z.infer<typeof OTPFormSchema>>({
        resolver: zodResolver(OTPFormSchema),
        defaultValues: {
            pin: '',
        },
    });
    async function onOTPSubmit(values: z.infer<typeof OTPFormSchema>) {
        if (initialResend) startResendTimer();
        setInitialResend(false);
        try {
            const res = await axios.post('/user/verify-otp/', {
                // email: form.getValues('email'),
                email: email,
                otp: values.pin,
            });
            if (res.status === 200) {
                setOpenOtp(false);
                router.push('/login');
            }
        } catch (error) {
            interface ErrorResponse {
                otp?: string[]; // Define the structure of your response data here
            }
            if (error instanceof AxiosError) {
                const err = error as AxiosError;
                const otpMessage =
                    (err.response?.data as ErrorResponse)?.otp?.[0] ??
                    'Invalid OTP';
                otpForm.setError('pin', {
                    type: 'manual',
                    message: otpMessage,
                });
            } else {
                console.log(error);
            }
        }
    }
    function startResendTimer() {
        setResendTimer(60); // Set initial timer value to 60 seconds
    }
    async function resendOTP(email: string) {
        try {
            await axios.post('user/resend-otp/', { email });
            startResendTimer(); // Start the resend timer
        } catch (error) {
            console.error('Error resending OTP:', error);
        }
    }
    useEffect(() => {
        let timerId: NodeJS.Timeout;

        // Decrement the timer every second until it reaches 0
        if (resendTimer > 0) {
            timerId = setTimeout(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        // Clear the timer when component unmounts
        return () => clearTimeout(timerId);
    }, [resendTimer]); // Run effect whenever resendTimer changes

    // Handler for resending OTP
    function handleResendOTP() {
        if (resendTimer === 0) {
            // resendOTP(form.getValues('email'));
            resendOTP(email);
        }
    }
    return (
        <Drawer open={openOtp} onOpenChange={setOpenOtp}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm flex flex-col items-center">
                    <DrawerHeader>
                        <DrawerTitle>Verify your email address</DrawerTitle>
                        <DrawerDescription>
                            We have sent a verification code to your email
                            address. Please enter the code below.
                        </DrawerDescription>
                    </DrawerHeader>
                    <Form {...otpForm}>
                        <form
                            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                            className="w-full space-y-6 flex flex-col items-center justify-center"
                        >
                            <FormField
                                control={otpForm.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-col items-center ">
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={4} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password
                                            sent to your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="w-full flex items-center justify-between pb-5">
                                <Button type="submit">Verify</Button>
                                <Button
                                    disabled={resendTimer > 0 || initialResend}
                                    variant={'secondary'}
                                    onClick={handleResendOTP}
                                    type="button"
                                >
                                    {resendTimer > 0
                                        ? `Resend OTP in ${resendTimer} seconds`
                                        : 'Resend OTP'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default OTPVerificationForm;
