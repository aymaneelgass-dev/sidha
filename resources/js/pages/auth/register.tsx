import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Registration unavailable" />

            <div className="flex flex-col gap-6 text-center">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">
                        Registration is unavailable
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        SIDHA accounts are created by an administrator.
                    </p>
                </div>

                <TextLink href={login()}>Return to log in</TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Internal access only',
    description: 'Contact an administrator if you need a SIDHA account.',
};
