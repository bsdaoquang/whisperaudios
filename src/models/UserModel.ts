export interface UserModel {
  uid?: string;
  metaData: any;
  displayName: string;
  email: string;
  mota: string;
  phoneNumber: string;
  photoURL: string;
  emailVerified: boolean;
  address?: string;
  description?: string;
}
