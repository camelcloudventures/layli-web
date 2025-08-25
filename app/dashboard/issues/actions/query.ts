import { useQuery, useMutation } from "@tanstack/react-query";
import { getIssues } from "./actions";
import { DELETE, POST } from "@/app/backend/apiMethods";

export function useGetIssues(enabled: boolean) {
  return useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      return await getIssues();
    },
    enabled: enabled ?? true,
  });
}

export function useRemoveAssignees() {
  return useMutation({
    mutationFn: async ({
      issueId,
      assigneeIds,
    }: {
      issueId: string;
      assigneeIds: string[];
    }) => {
      console.log("deletion id sent", assigneeIds);

      const data = {
        assigneeIds: assigneeIds,
      };

      console.log("data sent", data);
      return await POST(`/issues/${issueId}/assignees/remove`, data);
    },
  });
}

type IProps = {
  issue_id: string;
  attachmentsToAdd?: Array<{ fileName: string; fileUrl: string }>;
  attachmentsToRemove?: string[];
};
export function useUpdateIssueFiles() {
  return useMutation({
    mutationFn: async ({
      issue_id,
      attachmentsToRemove,
      attachmentsToAdd,
    }: IProps) => {
      if (attachmentsToRemove && attachmentsToRemove.length > 0) {
        // This is a DELETE operation
        const payload = {
          attachmentsToRemove: attachmentsToRemove,
        };
        console.log("DELETE payload sent is this", payload);
        return await DELETE(`/issues/${issue_id}/attachments`, payload);
      } else if (attachmentsToAdd && attachmentsToAdd.length > 0) {
        // This is a POST operation
        const payload = {
          attachmentsToAdd: attachmentsToAdd,
        };
        console.log("POST payload sent is this", payload);
        return await POST(`/issues/${issue_id}/attachments`, payload);
      }

      // Throw an error if neither payload is valid, preventing empty requests
      throw new Error(
        "Either attachmentsToAdd or attachmentsToRemove must be provided."
      );
    },
  });
}
