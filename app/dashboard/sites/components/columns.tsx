import { Site } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SubmitBtn from "@/components/custom/submit-btn";
import { Label } from "@/components/ui/label";
import {
  useDeleteSiteMutation,
  useUpdateSiteMutation,
} from "../actions/mutation";
import { toast } from "sonner";
import { useSitesStore } from "@/store/sites";
import { DeleteDialog } from "@/components/ui/delete-dialog";

function ActionsCell({ site }: { site: Site }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState(site.name);

  const { updateSite, removeSite } = useSitesStore();

  const { mutate: updateSiteMutation, isPending: isUpdating } =
    useUpdateSiteMutation();
  const { mutate: deleteSiteMutation } = useDeleteSiteMutation();

  const handleUpdate = () => {
    updateSiteMutation(
      { siteId: site.id, name: siteName },
      {
        //eslint-disable-next-line
        onSuccess: (data: any) => {
          console.log("REACHED HERE ====-------->");
          console.log("data", data);
          if (data?.statusCode >= 400 && data?.message) {
            toast.error(data.message);
          } else {
            console.log("got here");
            updateSite(String(site.id), siteName);
            toast.success("Site updated successfully");
            setIsEditDialogOpen(false);
          }
        },
        onError: () => {
          toast.error("An unexpected error occurred while updating the site.");
        },
      }
    );
  };

  const handleDelete = async () => {
    return new Promise<void>((resolve) => {
      deleteSiteMutation(site.id, {
        //eslint-disable-next-line
        onSuccess: (data: any) => {
          if (data?.statusCode >= 400 && data?.message) {
            toast.error(data.message);
            resolve();
          } else {
            removeSite(site.id);
            toast.success("Site deleted successfully");
            resolve();
          }
        },
        onError: () => {
          toast.error("An unexpected error occurred while deleting the site.");
          resolve();
        },
      });
    });
  };

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              setIsMenuOpen(false);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-blue-600 hover-text-blue-700 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteDialog
            onDelete={handleDelete}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 text-red-600 hover:text-red-700 mr-2" />
                Delete
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
          </div>
          <SubmitBtn
            onClick={handleUpdate}
            label={isUpdating ? "Updating..." : "Update Site"}
            variant="default"
            className=""
            isDisabled={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export const columns: ColumnDef<Site>[] = [
  {
    accessorKey: "name",
    header: "Site Name",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell site={row.original} />,
  },
];
