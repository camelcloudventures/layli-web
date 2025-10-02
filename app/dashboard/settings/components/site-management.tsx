import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SitesForm } from "./sites-form";
import { useState } from "react";
import { SiteFormData } from "../actions/types";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "../../sites/components/columns";
import { useCreateOrganizationSiteMutation } from "../../sites/actions/mutation";
import { toast } from "sonner";
import { useSites } from "@/hooks/use-sites";
import { SitesLoadingSkeleton } from "./sites-loading-skeleton";

export function SiteManagement() {
  const [isCreateSiteDialogOpen, setIsCreateSiteDialogOpen] = useState(false);
  const { sites, isLoading: isOrganizationSitesLoading } = useSites();
  const organizationSites = sites.data;

  const { mutate: addSiteMutation, isPending: isAddSiteMutationPending } =
    useCreateOrganizationSiteMutation();

  const handleSiteSubmit = (data: SiteFormData) => {
    addSiteMutation(data, {
      onSuccess: () => {
        toast.success("Site created successfully");
        setIsCreateSiteDialogOpen(false);
      },
      onError: (error) => {
        console.error("Error creating site:", error);
        toast.error("Error creating site", {
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items center">
        <h3 className="text-lg font-medium">Sites</h3>
        <Dialog
          open={isCreateSiteDialogOpen}
          onOpenChange={setIsCreateSiteDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateSiteDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Site
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6 max-h-[90vh] overflow-y-auto sm:max-w-[400px] overflow-hidden hover:overflow-y-auto scrollbar-none">
            <DialogHeader>
              <DialogTitle>Create a new site</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new site.
              </DialogDescription>
            </DialogHeader>
            <SitesForm
              onSubmit={handleSiteSubmit}
              isLoading={isAddSiteMutationPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isOrganizationSitesLoading ? (
        <SitesLoadingSkeleton />
      ) : (
        <div className="border rounded-md">
          <DataTable columns={columns} data={organizationSites} />
        </div>
      )}
    </div>
  );
}
