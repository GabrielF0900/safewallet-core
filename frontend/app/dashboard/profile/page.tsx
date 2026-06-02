'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { AvatarUser } from '@/components/avatar-user'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useWalletStore } from '@/lib/wallet-store'
import { User, Mail, Calendar, Shield, Key, Trash2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteAccount = () => {
    // Mock - In real app, would call API
    toast.info('Funcionalidade disponível em breve')
    setShowDeleteConfirm(false)
  }

  const handleChangePassword = () => {
    toast.info('Funcionalidade disponível em breve')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-6">
          <AvatarUser name={user?.name || 'Usuário'} size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user?.name || 'Usuário'}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Informações Pessoais
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome
            </Label>
            <Input
              id="name"
              value={user?.name || ''}
              disabled
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              E-mail
            </Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted/50"
            />
          </div>
          {user?.createdAt && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membro desde
              </Label>
              <Input
                value={new Date(user.createdAt).toLocaleDateString('pt-BR')}
                disabled
                className="bg-muted/50"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Para editar suas informações, entre em contato com o suporte.
        </p>
      </div>

      {/* Security Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Segurança
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Senha</p>
                <p className="text-sm text-muted-foreground">
                  Última alteração: nunca
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleChangePassword}>
              Alterar
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">
                  Autenticação de Dois Fatores
                </p>
                <p className="text-sm text-muted-foreground">
                  Proteção adicional para sua conta
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Em breve
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
        <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Zona de Perigo
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Ao deletar sua conta, todos os seus dados serão permanentemente
          removidos. Esta ação não pode ser desfeita.
        </p>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar Conta
        </Button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Deletar Conta"
        description="Tem certeza que deseja deletar sua conta? Todos os seus dados serão permanentemente removidos e esta ação não pode ser desfeita."
        confirmLabel="Sim, deletar minha conta"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteAccount}
        variant="destructive"
      />
    </div>
  )
}
