'use client'

import { useState } from "react"
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { PlusCircle, LayoutGrid, ListIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { mockActions } from '@/lib/data/mock-actions'
import type { Action, ActionStatus } from '@/lib/types/action-types'
import { ActionBoard } from './components/action-board'
import { ActionList } from './components/action-list'
import { ActionDialog } from './components/action-dialog'
import { ActionCard } from './components/action-card'

export default function ActionsClient() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [actions, setActions] = useState<Action[]>(mockActions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<Action | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<Action | null>(null)

  const handleCreateAction = () => {
    setCurrentAction(null)
    setIsDialogOpen(true)
  }

  const handleEditAction = (action: Action) => {
    setCurrentAction(action)
    setIsDialogOpen(true)
  }

  const handleSaveAction = async (action: Action) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (action.id) {
        // Update existing action
        setActions((prev) => prev.map((a) => (a.id === action.id ? action : a)))
        toast.success('Action updated')
      } else {
        // Create new action
        const newAction = {
          ...action,
          id: `action-${Date.now()}`,
          created_at: new Date().toISOString(),
          created_by_id: 'current-user-id', // In a real app, get from auth context
        }
        setActions((prev) => [...prev, newAction])
        toast.success('Action created')
      }
    } catch (error) {
      toast.error('There was an error saving the action.')
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteAction = async (actionId: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove the action from the state
      setActions((prev) => prev.filter((action) => action.id !== actionId))

      toast.success('Action deleted')
    } catch (error) {
      toast.error('There was an error deleting the action.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const draggedAction = actions.find((action) => action.id === active.id)
    if (draggedAction) {
      setActiveAction(draggedAction)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveAction(null)

    if (!over) return

    const activeActionId = active.id as string
    const overId = over.id as string

    // Check if the action was dropped into a column
    if (['todo', 'in_progress', 'completed'].includes(overId)) {
      const newStatus = overId as ActionStatus

      // Update the action status
      setActions((prev) =>
        prev.map((action) =>
          action.id === activeActionId
            ? { ...action, status: newStatus }
            : action,
        ),
      )

      // Show success toast
      toast.success(`Action moved to ${newStatus.replace('_', ' ')}`)
    }
    // If the action was dropped onto another action, we need to handle reordering
    else if (activeActionId !== overId) {
      const activeAction = actions.find((a) => a.id === activeActionId)
      const overAction = actions.find((a) => a.id === overId)

      if (activeAction && overAction) {
        // If dropping onto an action in a different column, update status
        if (activeAction.status !== overAction.status) {
          setActions((prev) =>
            prev.map((action) =>
              action.id === activeActionId
                ? { ...action, status: overAction.status }
                : action,
            ),
          )

          toast.success(
            `Action moved to ${overAction.status.replace('_', ' ')}`,
          )
        }
        // If dropping within the same column, reorder
        else {
          const oldIndex = actions.findIndex((a) => a.id === activeActionId)
          const newIndex = actions.findIndex((a) => a.id === overId)
          setActions(arrayMove(actions, oldIndex, newIndex))
        }
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
            <p className="text-muted-foreground">
              Manage action items and follow-ups
            </p>
          </div>
          <Button onClick={handleCreateAction}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Action
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Tabs
            defaultValue="board"
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'board' | 'list')}
            className="w-full"
          >
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="board">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListIcon className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-6">
              <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <ActionBoard
                  actions={actions}
                  onEditAction={handleEditAction}
                />
                <DragOverlay>
                  {activeAction ? (
                    <div className="w-[calc(100%-2rem)] max-w-sm">
                      <ActionCard
                        action={activeAction}
                        onClick={() => {}}
                        isDraggable={false}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <ActionList
                actions={actions}
                onEditAction={handleEditAction}
                onDeleteAction={handleDeleteAction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        action={currentAction}
        onSave={handleSaveAction}
        isLoading={isLoading}
      />
    </>
  )
}
