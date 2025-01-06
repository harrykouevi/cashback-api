// permission.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,Index,JoinColumn } from 'typeorm';
import { IsNotEmpty , IsOptional , IsEnum , IsEmail, IsDate, IsDateString, Equals, IsArray} from 'class-validator';
import { User } from './user.entity';



@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: string; // Nom de la permission sous forme de string

  @ManyToOne(() => User, (user) => user.permissions ,{ nullable: true , 
    cascade: true, // Automatically save permission when saving the user
    onDelete: 'SET NULL', // Ensure permissions are not deleted when user is deleted
  })
  user?: User;

  // @Column({ nullable: true })
  // userId: number;
}

export class AddPermissionDTO {
  @IsNotEmpty() // Ensures the email field is not empty
  @IsArray()
  permissions: string[];
}

export enum PermissionAccess {
    DeleteUser = 'deleteUser',       
    ViewDetailsUser = 'viewDetailsUser',         
    ViewListUser = 'viewListUser', 
}

export const rolePermissions = {
    ["admin"]: [
      PermissionAccess.DeleteUser,
      PermissionAccess.ViewListUser,
      PermissionAccess.ViewDetailsUser,
    ],
   
};