export interface UserOption {
  user: {
    id: string;
    full_name: string;
    role: string;
    email: string;
  };
}

export interface TemplateOption {
  id: number | string;
  title: string;
}

export interface SiteOption {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
