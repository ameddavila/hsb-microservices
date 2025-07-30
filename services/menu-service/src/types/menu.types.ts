export interface MenuAttributes {
  id: number;
  name: string;
  path: string;
  icon: string;
  parentId: number | null;
  isActive: boolean;
  sortOrder: number;
  permission?: string | null;
}
