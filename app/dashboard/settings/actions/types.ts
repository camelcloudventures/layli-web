import { Invite } from "../components/user-management";

export interface SiteFormData {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
}

export interface InviteResponse {
  data: Invite[];
}
