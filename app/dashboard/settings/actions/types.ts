import { Invite } from "../components/user-management";

export interface SiteFormData {
  id?: string;
  name: string;
  address?: string;
  longitude?: number;
  latitude?: number;
}

export interface InviteResponse {
  data: Invite[];
}
