import { Routes } from '@angular/router';
import { OperationsComponent } from '../pages/operations/operations.component';
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
        path: "ops",
        component : OperationsComponent
    },
    {
        path: "ops/files-ops",
        component : FilesOpsComponent
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
