import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {AccountComponent} from './account.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {InformationComponent} from './information/information.component';
import {AddressesComponent} from './addresses/addresses.component';
import {OrdersComponent} from './orders/orders.component';
import {PackageHistoryComponent} from './package-history/package-history.component';
import {DownloadComponent} from './download/download.component';
import {ReceiptComponent} from './receipt/receipt.component';
import {AuthGuard} from "../../auth.guard";
import {SalesDownloadComponent} from './sales-download/sales-download.component';
import {ShowCollectionComponent} from "./package-history/show-collection-dialog/show-collection.component";

export const routes = [
    {
        path: '',
        component: AccountComponent, children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: {breadcrumb: 'Dashboard'},
                canActivate: [AuthGuard]
            },
            {
                path: 'information',
                component: InformationComponent,
                data: {breadcrumb: 'Information'},
                canActivate: [AuthGuard]
            },
            {
                path: 'addresses',
                component: AddressesComponent,
                data: {breadcrumb: 'Addresses'},
                canActivate: [AuthGuard]
            },
            {path: 'orders', component: OrdersComponent, data: {breadcrumb: 'Orders'}, canActivate: [AuthGuard]},
            {
                path: 'package-history',
                component: PackageHistoryComponent,
                data: {breadcrumb: 'Package Hisory'},
                canActivate: [AuthGuard]
            },
            {
                path: 'download/:type',
                component: DownloadComponent,
                data: {breadcrumb: 'Download'},
                canActivate: [AuthGuard]
            },
            {
                path: 'sales-download',
                component: SalesDownloadComponent,
                data: {breadcrumb: 'Sales Download'},
                canActivate: [AuthGuard]
            },
            {path: 'receipt/:id', component: ReceiptComponent, data: {breadcrumb: 'Receipt'}, canActivate: [AuthGuard]}
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        AccountComponent,
        DashboardComponent,
        InformationComponent,
        AddressesComponent,
        OrdersComponent,
        DownloadComponent,
        SalesDownloadComponent,
        ReceiptComponent,
        PackageHistoryComponent,
        ShowCollectionComponent
    ],
    entryComponents: [
        ShowCollectionComponent
    ]
})
export class AccountModule {
}
