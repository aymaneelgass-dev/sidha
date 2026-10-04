import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm leading-tight font-semibold">
                    SIDHA
                </span>
                <span className="text-sidebar-foreground/60 truncate text-xs">
                    Creative Production
                </span>
            </div>
        </>
    );
}
