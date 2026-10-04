import { Link } from '@inertiajs/react';
import {
    AudioLines,
    CalendarDays,
    Clapperboard,
    LayoutDashboard,
    Settings,
    Sparkles,
    Users,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { SidhaAiCard } from '@/components/shell/sidha-ai-card';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as calendar } from '@/routes/calendar';
import { index as clients } from '@/routes/clients';
import { edit as editProfile } from '@/routes/profile';
import { index as projects } from '@/routes/projects';
import { index as sidhaAi } from '@/routes/sidha-ai';
import { index as studio } from '@/routes/studio';
import { index as team } from '@/routes/team';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
    { title: 'Projects', href: projects(), icon: Clapperboard },
    { title: 'Studio', href: studio(), icon: AudioLines },
    { title: 'Clients', href: clients(), icon: UsersRound },
    { title: 'Calendar', href: calendar(), icon: CalendarDays },
    { title: 'SIDHA AI', href: sidhaAi(), icon: Sparkles, badge: 'AI' },
    { title: 'Team', href: team(), icon: Users },
    { title: 'Settings', href: editProfile(), icon: Settings },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidhaAiCard href={projects()} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
