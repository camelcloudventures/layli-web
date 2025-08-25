import { IssueComment } from "@/lib/types/issue-types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { formatDateWithTime } from "@/lib/utils";

export default function Comments({ comments }: { comments: IssueComment[] }) {
  return (
    <div className="space-y-4 mt-16  ">
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-4 rounded-md border p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={"/placeholder.svg"}
                alt={
                  typeof comment.created_by === "object"
                    ? comment.created_by?.full_name || "User"
                    : "User"
                }
              />
              <AvatarFallback>
                {typeof comment.created_by === "object" &&
                comment.created_by?.full_name
                  ? comment.created_by.full_name[0]
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {typeof comment.created_by === "object"
                    ? comment.created_by?.full_name || "User"
                    : "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateWithTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
