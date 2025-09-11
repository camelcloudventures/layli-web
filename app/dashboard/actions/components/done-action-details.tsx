"use client";
import { Action } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Paperclip, MessageSquare, Calendar, Tag, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DoneActionDetailsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  action: Action | null;
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-base">{value}</div>
      </div>
    </div>
  );
}

export function DoneActionDetails({
  isOpen,
  onOpenChange,
  action,
}: DoneActionDetailsProps) {
  console.log("action", action);

  if (!action) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">{action?.title}</DialogTitle>
          <DialogDescription>{action?.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                icon={Tag}
                label="Status & Priority"
                value={
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{action?.status}</Badge>
                    <Badge variant="secondary">{action?.priority}</Badge>
                  </div>
                }
              />
              <DetailItem
                icon={Calendar}
                label="Due Date"
                value={format(new Date(action?.due_at), "PPP")}
              />
              {action.site && (
                <DetailItem
                  icon={MapPin}
                  label="Site"
                  value={action?.site?.name}
                />
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Completion Comments
              </h4>
              {action?.comments ? (
                <div className="bg-muted/50 p-3 rounded-lg">
                  {/* @ts-expect-error - this is a temporary fix to get the comments to display */}
                  <p className="text-sm">{action?.comments}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments provided.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Paperclip className="h-5 w-5 mr-2" />
                Attachments
              </h4>
              {/* @ts-expect-error - this is a temporary fix to get the attachment to display */}
              {action?.file ? (
                <div className="space-y-2">
                  <Link
                    // @ts-expect-error - this is a temporary fix to get the attachment to display
                    href={action?.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:underline"
                  >
                    <Paperclip className="h-4 w-4" />
                    {/* @ts-expect-error - this is a temporary fix to get the attachment to display */}
                    <span>{action?.file.split("/").pop()}</span>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No files attached.
                </p>
              )}
            </div>
            <Separator />

            <div>
              <h4 className="font-medium mb-3">Assignees</h4>
              <div className="flex flex-wrap gap-2">
                {action?.assignees?.map((assignee) => (
                  <Badge key={assignee.id} variant="outline">
                    {assignee.full_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
