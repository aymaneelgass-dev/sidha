import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="2"
                y="2"
                width="28"
                height="28"
                rx="9"
                fill="currentColor"
                opacity="0.16"
            />
            <path
                d="M22.5 9.5C20.7 8.1 18.6 7.4 16.1 7.4C12.4 7.4 9.8 9.3 9.8 12.1C9.8 15 12.1 16.2 16.2 17C19.1 17.6 20.2 18.2 20.2 19.6C20.2 21 18.8 21.9 16.6 21.9C14.1 21.9 11.8 21 9.8 19.2L8.2 22C10.4 24 13.3 25 16.5 25C20.5 25 23.4 23 23.4 19.6C23.4 16.8 21.4 15.4 17.1 14.5C14.1 13.9 13 13.4 13 12.1C13 11 14.2 10.3 16.1 10.3C18 10.3 19.7 10.9 21.1 12L22.5 9.5Z"
                fill="currentColor"
            />
        </svg>
    );
}
