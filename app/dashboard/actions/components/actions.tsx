'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Action, User } from '@/lib/types'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CreateActionForm } from './create-action-form'
import { ActionBoard } from './action-board'
import { DndProvider } from './dnd/dnd-context'
import { EditActionForm } from './edit-action-form'
import { Button } from '@/components/ui/button'
import { ActionList } from './action-list'

type View = 'board' | 'list'

export default function Actions({
  actions: initialActions,
  users,
}: {
  actions: Action[]
  users: User[]
}) {
  const [view, setView] = useState<View>('board')
  const [isCreateActionDialogOpen, setIsCreateActionDialogOpen] = useState(
    false,
  )
  const [isEditActionDialogOpen, setIsEditActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<Action | null>(null)
  const [actions, setActions] = useState<Action[]>([])

  useEffect(() => {
    setActions(initialActions)
  }, [initialActions])

  const handleEdit = (action: Action) => {
    setSelectedAction(action)
    setIsEditActionDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Actions</h1>
          <p className="text-muted-foreground">
            Manage action items and follow-ups
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
            <Button
              variant={view === 'board' ? 'default' : 'ghost'}
              onClick={() => setView('board')}
              size="sm"
            >
              Board
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
              size="sm"
            >
              List
            </Button>
          </div>
          <Button onClick={() => setIsCreateActionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Action
          </Button>
        </div>
      </div>
      <Dialog
        open={isCreateActionDialogOpen}
        onOpenChange={setIsCreateActionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Action</DialogTitle>
            <DialogDescription>
              Create a new action to assign and track.
            </DialogDescription>
          </DialogHeader>
          <CreateActionForm
            users={users}
            onCancel={() => setIsCreateActionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditActionDialogOpen}
        onOpenChange={setIsEditActionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Action</DialogTitle>
            <DialogDescription>
              Edit the details of this action.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <EditActionForm
              users={users}
              action={selectedAction}
              onCancel={() => setIsEditActionDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      {view === 'board' ? (
        <DndProvider setActions={setActions}>
          <ActionBoard actions={actions} onEdit={handleEdit} />
        </DndProvider>
      ) : (
        <ActionList actions={actions} />
      )}
    </div>
  )
}
