import { Routes } from '@angular/router';
import { OperationsComponent } from '../pages/operations/operations.component';
import { AddFileComponent } from '../pages/add-file/add-file.component';
import { DeleteFileComponent } from '../pages/delete-file/delete-file.component';

export const routes: Routes = [
    {
        path : "",
        redirectTo : "ops",
        pathMatch : 'full'
    },
    {
        path: "ops",
        component : OperationsComponent
    },
    {
        path: "ops/add-file",
        component: AddFileComponent
    },
    {
        path : "ops/delete-file",
        component : DeleteFileComponent
    }
];
