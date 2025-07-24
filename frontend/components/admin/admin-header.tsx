"use client"

import { useAuth } from '@/components/auth/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function AdminHeader() {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Panneau d&apos;administration</h1>
      <Button variant="outline" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
} 