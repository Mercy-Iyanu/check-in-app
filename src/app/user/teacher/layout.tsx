'use client'
import { User } from '@/helpers/constants'
import SideNav from '@/components/SideNavbar'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return <SideNav user={User.Teacher}>{children}</SideNav>
}
