import { Routes } from '@angular/router';
import { OperationsComponent } from '../pages/operations/operations.component';
import { AddFileComponent } from '../pages/add-file/add-file.component';
import { DeleteFileComponent } from '../pages/delete-file/delete-file.component';
import { CreateDirsComponent } from '../pages/create-dirs/create-dirs.component';
import { FilesOpsComponent } from '../pages/files-ops/files-ops.component';
import { DirsOpsComponent } from '../pages/dirs-ops/dirs-ops.component';
import { JobWorkerComponent } from '../pages/job-worker/job-worker.component';

export const routes: Routes = [
    {
        path : "",
        redirectTo : "ops",
        pathMatch : 'full'
    },
    {
        path: "ops/files-ops",
        component : FilesOpsComponent
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
    },
    {
        path: "ops/create-dirs",
        component : CreateDirsComponent
    },
    {
        path: "ops/dirs-ops",
        component: DirsOpsComponent
    },
    {
        path : "ops/jobs/:id",
        component : JobWorkerComponent
    }
];
