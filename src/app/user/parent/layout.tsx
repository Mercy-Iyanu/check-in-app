'use client'
import { User } from '@/helpers/constants'
import SideNav from '@/components/SideNavbar'

export default function ParentsLayout({ children }: { children: React.ReactNode }) {
    return <SideNav user={User.Parent}>{children}</SideNav>
}
