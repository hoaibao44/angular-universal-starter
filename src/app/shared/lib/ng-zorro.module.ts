import { NgModule } from "@angular/core";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

const TARGET_COMPONENTS = [
    NzIconModule,
    NzButtonModule,
    NzTypographyModule,
    NzBreadCrumbModule
]

@NgModule({
    imports:[
        TARGET_COMPONENTS
    ],
    exports:[
        TARGET_COMPONENTS
    ]
})
export class ZorroModule{}