import {Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Results, User, WishList, CartData} from '../../app.models';
import {AuthenticationService} from '../../authentication.service';

@Component({
    selector: 'app-wishlist-dialog',
    templateUrl: './wishlist-dialog.component.html',
    styleUrls: ['./wishlist-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WishlistDialogComponent implements OnInit {
    wishlistForm: FormGroup;
    currentUser: User;
    wishList: WishList[];
    wishProduct: CartData;

    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, public appService: AppService,
                public dialogRef: MatDialogRef<WishlistDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public product: Results, public authservice: AuthenticationService) {
        this.authservice.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        this.wishProduct = Object.assign({
                id: this.product.id,
                filename:  this.product.filename,
                thumbnail:  this.product.thumbnail,
                large_thumbnail:  this.product.large_thumbnail,
                preview: this.product.preview,
                license:  this.product.license,
                collection:  this.product.collection,
                type: this.product.preview.endsWith('.mp4') ? 'Video' : 'Image',
                caption:  this.product.caption,
                category:  this.product.category,
                time: this.product.time,
                author: this.product.author
            });
        this.wishlistForm = this.formBuilder.group({
            'title': ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
        });
        this.getWishList();
    }

    public onSubmit(values: Object, image:Results): void {
        if (this.wishlistForm.valid) {
            console.log(this.wishProduct);
            this.appService.addToWishListDB(JSON.stringify(this.wishProduct), values["title"], this.currentUser.customers_id).subscribe(data => {
                if(data['statusCode']==200)
                {
                    this.snackBar.open("Your Lightbox has been successfully created", '×', { panelClass: "success", verticalPosition: 'top', duration: 3000 });
                    this.dialogRef.close();
                }else{
                    this.snackBar.open("Image not added there is some issue", '×', { panelClass: "error", verticalPosition: 'top', duration: 3000 });
                }
            });
        }

    }

    public getWishList() {
        this.appService.getWishList(this.currentUser.customers_id).subscribe(data => {
            this.wishList = data['data'];
        });
    }

    public addToWishList(image: Results, selectedWishList:WishList) {

        if(selectedWishList.imagesArray.filter(arr => arr.id == image.id).length > 0)
        {
            this.snackBar.open("Images already exist in this lightbox", '×', { panelClass: "error", verticalPosition: 'top', duration: 3000 });
        }else{
            this.appService.updateToWishListDB(JSON.stringify(this.wishProduct), selectedWishList.id, false).subscribe(data => {
                if(data['statusCode']==200)
                {
                    this.snackBar.open("Images added to lightbox", '×', { panelClass: "success", verticalPosition: 'top', duration: 3000 });
                    this.dialogRef.close();
                }else{
                    this.snackBar.open("Image not added there is some issue", '×', { panelClass: "error", verticalPosition: 'top', duration: 3000 });
                }
            });
        }


    }

    public close(): void {
        this.dialogRef.close();
    }
}