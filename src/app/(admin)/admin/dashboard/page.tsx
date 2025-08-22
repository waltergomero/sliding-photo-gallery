import React from 'react';
import { requireAdmin } from '@/lib/auth-guard';  

const DashboardPage = async () => {
    
       await requireAdmin();
  return (
    <div>Dashboard</div>
  )
}

export default DashboardPage