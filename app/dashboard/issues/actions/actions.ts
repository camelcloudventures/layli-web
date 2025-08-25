"use server";

import { DELETE, GET, POST, UPDATE } from "@/app/backend/apiMethods";
import { Assignee } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { IssuesResponse } from "./types";

export async function createIssue(
  formData: FormData,
  assignees: Assignee[],
  reporter: Assignee
) {
  const category = formData.get("category");
  const priority = formData.get("priority");
  const cause = formData.get("cause");
  const due_at = formData.get("date");
  const title = formData.get("title");
  const images = JSON.parse(formData.get("images") as string);

  const attachments = images?.map(
    (image: { uploadedUrl: string; originalFileName: string }) => ({
      fileName: image.originalFileName,
      fileUrl: image.uploadedUrl,
    })
  );
  console.log("attachments", attachments);

  const data = {
    category,
    priority,
    assignees,
    due_at,
    cause,
    title,
    attachments,
    reporter,
  };

  console.log("data for submission", data);
  // return;
  const response = await POST("/issues/create", data, true);
  revalidateTag("issues");
  return response;
}

export async function getIssues(): Promise<IssuesResponse | null> {
  return await GET<IssuesResponse>("/issues", ["issues"]);
}

export async function updateIssue(issueId: string, formData: FormData) {
  // Get basic issue data
  const payload: {
    title: string;
    cause: string;
    solution: string;
    status: string;
    priority: string;
    assignees: FormDataEntryValue[];
    due_at: string | null;
    attachmentsToAdd?: Array<{ fileName: string; fileUrl: string }>;
    attachmentIdsToDelete?: string[];
  } = {
    title: formData.get("title") as string,
    cause: formData.get("cause") as string,
    solution: formData.get("solution") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    assignees: formData.getAll("assignee_ids"),
    due_at: formData.get("due_at")
      ? new Date(formData.get("due_at") as string).toISOString()
      : null,
  };

  // Handle attachments if provided
  const attachmentsToAdd = formData.get("attachmentsToAdd");
  const attachmentIdsToDelete = formData.get("attachmentIdsToDelete");

  if (attachmentsToAdd) {
    payload.attachmentsToAdd = JSON.parse(attachmentsToAdd as string);
  }

  if (attachmentIdsToDelete) {
    payload.attachmentIdsToDelete = JSON.parse(attachmentIdsToDelete as string);
  }

  const res = await UPDATE(`/issues/${issueId}/update`, payload, ["issues"]);
  revalidateTag("issues");
  return res;
}

export async function updateAttachments(
  issueId: string,
  attachmentsToAdd?: Array<{ fileName: string; fileUrl: string }>,
  attachmentIdsToDelete?: string[]
) {
  const payload: {
    attachmentsToAdd?: Array<{ fileName: string; fileUrl: string }>;
    attachmentIdsToDelete?: string[];
  } = {};

  if (attachmentsToAdd && attachmentsToAdd.length > 0) {
    payload.attachmentsToAdd = attachmentsToAdd;
  }

  if (attachmentIdsToDelete && attachmentIdsToDelete.length > 0) {
    payload.attachmentIdsToDelete = attachmentIdsToDelete;
  }

  const res = await UPDATE(`/issues/${issueId}/update`, payload, ["issues"]);
  console.log("res is this from the server", res);
  revalidateTag("issues");
  return res;
}

export async function addComment(
  issueId: string,
  formData: FormData,

  commenter: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  }
) {
  const comment = formData.get("comment") as string;
  const data = {
    comment,
    commenter,
  };

  const res = await POST(`/issues/${issueId}/comments/add`, data);
  revalidateTag("issues");
  return res;
}

export async function shareIssue(issueId: string, assignees: Assignee[]) {
  console.log("assignees", assignees);
  const res = await POST(`/issues/${issueId}/assignees/add`, assignees);
  revalidateTag("issues");
  return res;
}

export async function closeIssue(issueId: string, solution: string) {
  const res = await UPDATE(`/issues/${issueId}/close`, {
    solution,
  });
  revalidateTag("issues");
  return res;
}

export async function deleteIssue(issueId: string) {
  const res = await DELETE(`/issues/${issueId}/delete`, {});
  revalidateTag("issues");
  return res;
}
