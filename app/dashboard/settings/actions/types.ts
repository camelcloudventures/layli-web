import { Invite } from "../components/user-management";

export interface SiteFormData {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface InviteResponse {
  data: Invite[];
}
