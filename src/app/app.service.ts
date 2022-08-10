import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {
    CartData,
    CartStatus,
    Category,
    ContributorData,
    Images,
    Order,
    Plan,
    Product,
    Results,
    Subscription,
    User,
    WishList
} from './app.models';
import {environment} from '../environments/environment';

export class Data {
    constructor(public categories: Category[],
                public compareList: Product[],
                public wishList: Product[],
                public cartList: CartData[],
                public totalPrice: number,
                public totalCartCount: number,
                public categoriesType: Category[],
                public wishListing: WishList[]) {
    }
}

@Injectable()
export class AppService {
    public Data = new Data(
        [], // categories
        [], // compareList
        [],  // wishList
        [],  // cartList
        null, // totalPrice,
        0, // totalCartCount,
        [],
        []
    );
    public url = 'assets/data/';

    public backendUrl = environment.apiUrl;
    public searchApiUrl = environment.searchApiUrl;
    public searchEdiApiUrl = environment.searchEdiApiUrl;
    public contributorUrl = environment.contributorUrl;
    public ccAvenueResponseUrl = environment.ccAvenueResponseUrl;
    public cashfreeResponseUrl = environment.cashfreeResponseUrl;
    public merchant = environment.merchant;
    public accessCode = environment.accessCode;
    public ccavenueUrl = environment.ccavenueUrl;
    public cashfreeUrl = environment.cashfreeUrl;
    public displayCollectionName = environment.displayCollectionName;

    constructor(public http: HttpClient, public snackBar: MatSnackBar) {
    }

    public getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.url + 'categories.json');
    }

    public getCollectionType(): Observable<Category[]> {
        return this.http.get<Category[]>(this.url + 'collection.json');
    }

    public getCreativeImages(text, noOfImages, page, filter, skipLoader): Observable<Images> {
        return this.http.get<Images>(this.searchApiUrl + '?searchtext=' + text + '&images='
            + noOfImages + '&page=' + page + '' + filter, {
            params: {skipLoader}
        });
    }

    public getContributorData(text, collection): Observable<ContributorData[]> {
        return this.http.get<ContributorData[]>(this.contributorUrl + '/contributor-data.php?contributor_code=' + text + '&collection=' + collection);
    }

    public getVideos(text, no, page, filter, skipLoader, editorial, customerId): Observable<Images> {

        return this.http.get<Images>(this.backendUrl + 'auth/videoSearch?searchText=' + text + '&no=' + no
            + '&page=' + page + '&editorial=' + editorial + '&filter=' + filter + '&customerId=' + customerId
            , {
                params: {skipLoader}
            });
    }

    public getEditorialImages(text, noOfImages, page, filter, skipLoader): Observable<Images> {
        return this.http.get<Images>(this.searchEdiApiUrl + '?advsearchtxt=' + text
            + '&noimages=' + noOfImages + '&page=' + page + '&filter=' + filter,
            {
                params: {skipLoader}
            });
        // "&coll_id=$coll_id&type=$type&category=$category");
    }

    public getImageById(id, collection): Observable<Results> {
        return this.http.get<Results>(this.backendUrl + 'auth/singleImageDetail?imageId=' + id + '&collection=' + collection + '');
    }

    public getVideoById(id, collection): Observable<Results> {
        return this.http.get<Results>(this.backendUrl + 'auth/singleVideoDetail?' + 'item=' + id + '&collection=' + collection + '');
    }

    public getBanners(type): Observable<any[]> {
        return this.http.get<any[]>(this.url + type + '-banners.json');
    }

    public getConfig(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'config.json');
    }

    public signIn(email, password): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/login', {email, password});
    }

    public register(name, email, phone, password): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/register', {name, email, phone, password});
    }

    public verifyCaptcha(captchaResponse): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/verifyCaptcha', {captchaResponse});
    }

    public updateProfile(firstname, lastname, email, company, com_type, job_desc, address, state, pincode, city, phone, fax, user_id): Observable<User> {
        return this.http.post<any>(this.backendUrl + 'auth/updateProfile', {
            firstname,
            lastname,
            email,
            company,
            com_type,
            job_desc,
            address,
            state,
            pincode,
            city,
            phone,
            fax,
            user_id
        });
    }

    public getUserDetail(email): Observable<User> {
        return this.http.post<any>(this.backendUrl + 'auth/getUserDetail', {email});
    }

    public changePassword(email, new_pass, current_pass, encrypted_pass, is_encrypted): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/changePassword', {
            email,
            new_pass,
            current_pass,
            encrypted_pass,
            is_encrypted
        });
    }

    public logout(): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/logout', {});
    }

    public getWishList(customer_id): Observable<WishList[]> {
        return this.http.get<WishList[]>(this.backendUrl + 'wishlist?customer_id=' + customer_id);
    }

    public getWishListById(id): Observable<WishList> {
        return this.http.get<WishList>(this.backendUrl + 'wishlist/' + id);
    }

    public getWishListByToken(token): Observable<WishList> {
        return this.http.get<WishList>(this.backendUrl + 'auth/wishlist/' + token);
    }

    public addToWishListDB(image: string, name: string, customer_id: string) {
        return this.http.post<WishList>(this.backendUrl + 'wishlist', {customer_id, name, image});
    }

    public updateToWishListDB(image: string, id: number, isDelete: boolean) {
        return this.http.put<WishList>(this.backendUrl + 'wishlist', {id, image, isDelete});
    }

    public removeWishList(id: number) {
        return this.http.delete<WishList>(this.backendUrl + 'wishlist?id=' + id);
    }

    public shareLightbox(email: string, id: number) {
        return this.http.post<any>(this.backendUrl + 'share-lightbox', {email, id});
    }

    public addToCartListDB(image: string, customer_id: string) {
        return this.http.post<any>(this.backendUrl + 'cartlist', {customer_id, image});
    }

    public addContact(name: string, email: string, mobile: string, message: string) {
        return this.http.post<any>(this.backendUrl + 'auth/contact', {name, email, mobile, message});
    }

    public addSubscribe(email: string) {
        return this.http.post<any>(this.backendUrl + 'auth/subscribe', {email});
    }

    public removeCartList(customer_id: string) {
        return this.http.delete<CartStatus>(this.backendUrl + 'cartlist?customer_id=' + customer_id);
    }

    public removeCartProduct(image: string, customer_id: string) {
        return this.http.post<CartStatus>(this.backendUrl + 'cartProduct', {customer_id, image});
    }

    public getCartList(customer_id: string) {
        return this.http.get<CartData[]>(this.backendUrl + 'cartlist?customer_id=' + customer_id);
    }

    public getOrders(customer_id: string) {
        return this.http.get<Order[]>(this.backendUrl + 'order?customer_id=' + customer_id);
    }

    public getPackageHistory(customer_id: string) {
        return this.http.get<Order[]>(this.backendUrl + 'package-history?customer_id=' + customer_id);
    }

    public getOrdersSingle(customer_id: string, type: string) {
        return this.http.get<any[]>(this.backendUrl + 'orderSingle?customer_id=' + customer_id + '&type=' + type);
    }

    public getSalesDownload(customer_id: string) {
        return this.http.get<any[]>(this.backendUrl + 'sales-download?customer_id=' + customer_id);
    }

    public getPlanDetail() {
        return this.http.get<Array<Plan>>(this.backendUrl + 'auth/plan');
    }

    public forgotPassword(email: string) {
        return this.http.get<any>(this.backendUrl + 'auth/resetPassword?email=' + email);
    }

    // public addToCompare(product:Product){
    //     let message, status;
    //     if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
    //         message = 'The product ' + product.id + ' already added to comparison list.';
    //         status = 'error';
    //     }
    //     else{
    //         this.Data.compareList.push(product);
    //         message = 'The product ' + product.id + ' has been added to comparison list.';
    //         status = 'success';
    //     }
    //     this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    // }
    //


    // public addToWishList(product:Product){
    //     let message, status;
    //     if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
    //         message = 'The product ' + product.id + ' already added to wish list.';
    //         status = 'error';
    //     }
    //     else{
    //         this.Data.wishList.push(product);
    //         message = 'The product ' + product.id + ' has been added to wish list.';
    //         status = 'success';
    //     }
    //     this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    // }


    public addToCart(product: CartData[], totalPrice: number, totalCartCount: number) {
        let message, status;
        this.Data.totalPrice = totalPrice;
        this.Data.totalCartCount = totalCartCount;
        this.Data.cartList = product;
        // this.Data.cartList.push(product);
        //
        // this.Data.cartList.forEach(product=>{
        //     this.Data.totalPrice = this.Data.totalPrice +parseInt(product.price+"");
        //     this.Data.totalCartCount = this.Data.totalCartCount + 1;
        // });
    }

    // public addToCartOld(product:Product){
    //     let message, status;
    //
    //     this.Data.totalPrice = null;
    //     this.Data.totalCartCount = null;
    //
    //     if(this.Data.cartList.filter(item=>item.id == product.id)[0]){
    //         let item = this.Data.cartList.filter(item=>item.id == product.id)[0];
    //         item.cartCount = product.cartCount;
    //     }
    //     else{
    //         this.Data.cartList.push(product);
    //     }
    //     this.Data.cartList.forEach(product=>{
    //         this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.newPrice);
    //         this.Data.totalCartCount = this.Data.totalCartCount + product.cartCount;
    //     });
    //
    //     message = 'The product ' + product.id + ' has been added to cart.';
    //     status = 'success';
    //     this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    // }


    public resetProductCartCount(product: CartData) {
        product.cartCount = 0;
        const compareProduct = this.Data.compareList.filter(item => item.id == product.id)[0];
        if (compareProduct) {
            compareProduct.cartCount = 0;
        }
        const wishProduct = this.Data.wishList.filter(item => item.id == product.id)[0];
        if (wishProduct) {
            wishProduct.cartCount = 0;
        }
    }

    public getSubscriptionDetail(category: string, collection: string, image_id: string, license: string) {
        return this.http.post<Subscription[]>(this.backendUrl + 'subscription-detail', {
            category,
            collection,
            image_id,
            license
        });
    }

    public getDownloadVideoDetail(category: string, collection: string, video_id: string, license: string) {
        return this.http.post<Subscription[]>(this.backendUrl + 'download-video-detail', {
            category,
            collection,
            video_id,
            license
        });
    }

    public getBrands() {
        return [
            {name: 'aloha', image: 'assets/images/brands/aloha.png'},
            {name: 'dream', image: 'assets/images/brands/dream.png'},
            {name: 'congrats', image: 'assets/images/brands/congrats.png'},
            {name: 'best', image: 'assets/images/brands/best.png'},
            {name: 'original', image: 'assets/images/brands/original.png'},
            {name: 'retro', image: 'assets/images/brands/retro.png'},
            {name: 'king', image: 'assets/images/brands/king.png'},
            {name: 'love', image: 'assets/images/brands/love.png'},
            {name: 'the', image: 'assets/images/brands/the.png'},
            {name: 'easter', image: 'assets/images/brands/easter.png'},
            {name: 'with', image: 'assets/images/brands/with.png'},
            {name: 'special', image: 'assets/images/brands/special.png'},
            {name: 'bravo', image: 'assets/images/brands/bravo.png'}
        ];
    }

    public getInternationalSearchCollection(name: string): Observable<any[]> {
        return this.http.get<any[]>(this.url + name + '-international-collection-search.json');
    }

    public getIndianSearchCollection(name: string): Observable<any[]> {
        return this.http.get<any[]>(this.url + name + '-indian-collection-search.json');
    }

    public getSlides(name: string): Observable<any[]> {
        return this.http.get<any[]>(this.url + name + '.json');
    }

    public downloadImage(imageData: CartData, type: boolean): Observable<Subscription[]> {
        return this.http.post<Subscription[]>(this.backendUrl + 'download', {imageData, type});
    }

    public reDownloadImage(id: number): Observable<string> {
        return this.http.post<string>(this.backendUrl + 'reDownloadImage', {id});
    }

    public reDownloadImageById(imageId: string, size: string): Observable<string> {
        return this.http.post<string>(this.backendUrl + 'reDownloadImageById', {imageId, size});
    }

    public downloadVideo(imageData: CartData, type: boolean): Observable<Subscription[]> {
        return this.http.post<Subscription[]>(this.backendUrl + 'download-video', {imageData, type});
    }

    public downloadSalesImage(imageData: CartData, type: boolean): Observable<Subscription[]> {
        return this.http.post<Subscription[]>(this.backendUrl + 'download-sales-image', {imageData});
    }

    public downloadSalesVideo(imageData: CartData): Observable<Subscription[]> {
        return this.http.post<Subscription[]>(this.backendUrl + 'download-sales-video', {imageData});
    }

    public compDownload(imageData: CartData): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'comp-download', {imageData});
    }

    public verification(token: string): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'auth/verifyAccount', {token});
    }

    public getOrderImages(orderId: number): Observable<any> {
        return this.http.post<any>(this.backendUrl + 'receiptImages', {orderId});
    }

    public getCompType() {
        return [
            {name: 'Advertising Agency', code: '1'},
            {name: 'Corporation', code: '2'},
            {name: 'Education/Government', code: '10'},
            {name: 'Film Studio', code: '3'},
            {name: 'Freelance/Consultant', code: '4'},
            {name: 'Graphic Design Company', code: '5'},
            {name: 'Home Office', code: '6'},
            {name: 'In-house Creative Group', code: '8'},
            {name: 'Marketing Communications', code: '7'},
            {name: 'Non-profit/Cultural Institution', code: '9'},
            {name: 'Production/Post-production Company', code: '11'},
            {name: 'Publisher-Book', code: '15'},
            {name: 'Publisher-Internet', code: '18'},
            {name: 'Publisher-Magazine', code: '12'},
            {name: 'Publisher-Newspaper', code: '19'},
            {name: 'Sports Body', code: '16'},
            {name: 'Sport Sponsor', code: '17'},
            {name: 'Television Network', code: '13'},
            {name: 'Other', code: '14'}
        ];
    }

    public getJobDesc() {
        return [
            {name: 'Account Executive', code: '1'},
            {name: 'Art Buyer', code: '3'},
            {name: 'Art Director/Creative Director', code: '4'},
            {name: 'Designer', code: '5'},
            {name: 'Film/Video Editor', code: '6'},
            {name: 'Freelance/Consultant', code: '7'},
            {name: 'Manager/Administrator', code: '2'},
            {name: 'Photo Editor', code: '15'},
            {name: 'Photo/Film Researcher', code: '9'},
            {name: 'Photographer', code: '8'},
            {name: 'Producer', code: '11'},
            {name: 'Production/Post-production', code: '10'},
            {name: 'Student/Educator/Trainer', code: '12'},
            {name: 'Writer/Copywriter/Editor', code: '13'},
            {name: 'Other', code: '14'}
        ];
    }

    public getCountries() {
        return [
            {name: 'Afghanistan', code: 'AF'},
            {name: 'Aland Islands', code: 'AX'},
            {name: 'Albania', code: 'AL'},
            {name: 'Algeria', code: 'DZ'},
            {name: 'American Samoa', code: 'AS'},
            {name: 'AndorrA', code: 'AD'},
            {name: 'Angola', code: 'AO'},
            {name: 'Anguilla', code: 'AI'},
            {name: 'Antarctica', code: 'AQ'},
            {name: 'Antigua and Barbuda', code: 'AG'},
            {name: 'Argentina', code: 'AR'},
            {name: 'Armenia', code: 'AM'},
            {name: 'Aruba', code: 'AW'},
            {name: 'Australia', code: 'AU'},
            {name: 'Austria', code: 'AT'},
            {name: 'Azerbaijan', code: 'AZ'},
            {name: 'Bahamas', code: 'BS'},
            {name: 'Bahrain', code: 'BH'},
            {name: 'Bangladesh', code: 'BD'},
            {name: 'Barbados', code: 'BB'},
            {name: 'Belarus', code: 'BY'},
            {name: 'Belgium', code: 'BE'},
            {name: 'Belize', code: 'BZ'},
            {name: 'Benin', code: 'BJ'},
            {name: 'Bermuda', code: 'BM'},
            {name: 'Bhutan', code: 'BT'},
            {name: 'Bolivia', code: 'BO'},
            {name: 'Bosnia and Herzegovina', code: 'BA'},
            {name: 'Botswana', code: 'BW'},
            {name: 'Bouvet Island', code: 'BV'},
            {name: 'Brazil', code: 'BR'},
            {name: 'British Indian Ocean Territory', code: 'IO'},
            {name: 'Brunei Darussalam', code: 'BN'},
            {name: 'Bulgaria', code: 'BG'},
            {name: 'Burkina Faso', code: 'BF'},
            {name: 'Burundi', code: 'BI'},
            {name: 'Cambodia', code: 'KH'},
            {name: 'Cameroon', code: 'CM'},
            {name: 'Canada', code: 'CA'},
            {name: 'Cape Verde', code: 'CV'},
            {name: 'Cayman Islands', code: 'KY'},
            {name: 'Central African Republic', code: 'CF'},
            {name: 'Chad', code: 'TD'},
            {name: 'Chile', code: 'CL'},
            {name: 'China', code: 'CN'},
            {name: 'Christmas Island', code: 'CX'},
            {name: 'Cocos (Keeling) Islands', code: 'CC'},
            {name: 'Colombia', code: 'CO'},
            {name: 'Comoros', code: 'KM'},
            {name: 'Congo', code: 'CG'},
            {name: 'Congo, The Democratic Republic of the', code: 'CD'},
            {name: 'Cook Islands', code: 'CK'},
            {name: 'Costa Rica', code: 'CR'},
            {name: 'Cote D\'Ivoire', code: 'CI'},
            {name: 'Croatia', code: 'HR'},
            {name: 'Cuba', code: 'CU'},
            {name: 'Cyprus', code: 'CY'},
            {name: 'Czech Republic', code: 'CZ'},
            {name: 'Denmark', code: 'DK'},
            {name: 'Djibouti', code: 'DJ'},
            {name: 'Dominica', code: 'DM'},
            {name: 'Dominican Republic', code: 'DO'},
            {name: 'Ecuador', code: 'EC'},
            {name: 'Egypt', code: 'EG'},
            {name: 'El Salvador', code: 'SV'},
            {name: 'Equatorial Guinea', code: 'GQ'},
            {name: 'Eritrea', code: 'ER'},
            {name: 'Estonia', code: 'EE'},
            {name: 'Ethiopia', code: 'ET'},
            {name: 'Falkland Islands (Malvinas)', code: 'FK'},
            {name: 'Faroe Islands', code: 'FO'},
            {name: 'Fiji', code: 'FJ'},
            {name: 'Finland', code: 'FI'},
            {name: 'France', code: 'FR'},
            {name: 'French Guiana', code: 'GF'},
            {name: 'French Polynesia', code: 'PF'},
            {name: 'French Southern Territories', code: 'TF'},
            {name: 'Gabon', code: 'GA'},
            {name: 'Gambia', code: 'GM'},
            {name: 'Georgia', code: 'GE'},
            {name: 'Germany', code: 'DE'},
            {name: 'Ghana', code: 'GH'},
            {name: 'Gibraltar', code: 'GI'},
            {name: 'Greece', code: 'GR'},
            {name: 'Greenland', code: 'GL'},
            {name: 'Grenada', code: 'GD'},
            {name: 'Guadeloupe', code: 'GP'},
            {name: 'Guam', code: 'GU'},
            {name: 'Guatemala', code: 'GT'},
            {name: 'Guernsey', code: 'GG'},
            {name: 'Guinea', code: 'GN'},
            {name: 'Guinea-Bissau', code: 'GW'},
            {name: 'Guyana', code: 'GY'},
            {name: 'Haiti', code: 'HT'},
            {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
            {name: 'Holy See (Vatican City State)', code: 'VA'},
            {name: 'Honduras', code: 'HN'},
            {name: 'Hong Kong', code: 'HK'},
            {name: 'Hungary', code: 'HU'},
            {name: 'Iceland', code: 'IS'},
            {name: 'India', code: 'IN'},
            {name: 'Indonesia', code: 'ID'},
            {name: 'Iran, Islamic Republic Of', code: 'IR'},
            {name: 'Iraq', code: 'IQ'},
            {name: 'Ireland', code: 'IE'},
            {name: 'Isle of Man', code: 'IM'},
            {name: 'Israel', code: 'IL'},
            {name: 'Italy', code: 'IT'},
            {name: 'Jamaica', code: 'JM'},
            {name: 'Japan', code: 'JP'},
            {name: 'Jersey', code: 'JE'},
            {name: 'Jordan', code: 'JO'},
            {name: 'Kazakhstan', code: 'KZ'},
            {name: 'Kenya', code: 'KE'},
            {name: 'Kiribati', code: 'KI'},
            {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
            {name: 'Korea, Republic of', code: 'KR'},
            {name: 'Kuwait', code: 'KW'},
            {name: 'Kyrgyzstan', code: 'KG'},
            {name: 'Lao People\'S Democratic Republic', code: 'LA'},
            {name: 'Latvia', code: 'LV'},
            {name: 'Lebanon', code: 'LB'},
            {name: 'Lesotho', code: 'LS'},
            {name: 'Liberia', code: 'LR'},
            {name: 'Libyan Arab Jamahiriya', code: 'LY'},
            {name: 'Liechtenstein', code: 'LI'},
            {name: 'Lithuania', code: 'LT'},
            {name: 'Luxembourg', code: 'LU'},
            {name: 'Macao', code: 'MO'},
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
            {name: 'Madagascar', code: 'MG'},
            {name: 'Malawi', code: 'MW'},
            {name: 'Malaysia', code: 'MY'},
            {name: 'Maldives', code: 'MV'},
            {name: 'Mali', code: 'ML'},
            {name: 'Malta', code: 'MT'},
            {name: 'Marshall Islands', code: 'MH'},
            {name: 'Martinique', code: 'MQ'},
            {name: 'Mauritania', code: 'MR'},
            {name: 'Mauritius', code: 'MU'},
            {name: 'Mayotte', code: 'YT'},
            {name: 'Mexico', code: 'MX'},
            {name: 'Micronesia, Federated States of', code: 'FM'},
            {name: 'Moldova, Republic of', code: 'MD'},
            {name: 'Monaco', code: 'MC'},
            {name: 'Mongolia', code: 'MN'},
            {name: 'Montserrat', code: 'MS'},
            {name: 'Morocco', code: 'MA'},
            {name: 'Mozambique', code: 'MZ'},
            {name: 'Myanmar', code: 'MM'},
            {name: 'Namibia', code: 'NA'},
            {name: 'Nauru', code: 'NR'},
            {name: 'Nepal', code: 'NP'},
            {name: 'Netherlands', code: 'NL'},
            {name: 'Netherlands Antilles', code: 'AN'},
            {name: 'New Caledonia', code: 'NC'},
            {name: 'New Zealand', code: 'NZ'},
            {name: 'Nicaragua', code: 'NI'},
            {name: 'Niger', code: 'NE'},
            {name: 'Nigeria', code: 'NG'},
            {name: 'Niue', code: 'NU'},
            {name: 'Norfolk Island', code: 'NF'},
            {name: 'Northern Mariana Islands', code: 'MP'},
            {name: 'Norway', code: 'NO'},
            {name: 'Oman', code: 'OM'},
            {name: 'Pakistan', code: 'PK'},
            {name: 'Palau', code: 'PW'},
            {name: 'Palestinian Territory, Occupied', code: 'PS'},
            {name: 'Panama', code: 'PA'},
            {name: 'Papua New Guinea', code: 'PG'},
            {name: 'Paraguay', code: 'PY'},
            {name: 'Peru', code: 'PE'},
            {name: 'Philippines', code: 'PH'},
            {name: 'Pitcairn', code: 'PN'},
            {name: 'Poland', code: 'PL'},
            {name: 'Portugal', code: 'PT'},
            {name: 'Puerto Rico', code: 'PR'},
            {name: 'Qatar', code: 'QA'},
            {name: 'Reunion', code: 'RE'},
            {name: 'Romania', code: 'RO'},
            {name: 'Russian Federation', code: 'RU'},
            {name: 'RWANDA', code: 'RW'},
            {name: 'Saint Helena', code: 'SH'},
            {name: 'Saint Kitts and Nevis', code: 'KN'},
            {name: 'Saint Lucia', code: 'LC'},
            {name: 'Saint Pierre and Miquelon', code: 'PM'},
            {name: 'Saint Vincent and the Grenadines', code: 'VC'},
            {name: 'Samoa', code: 'WS'},
            {name: 'San Marino', code: 'SM'},
            {name: 'Sao Tome and Principe', code: 'ST'},
            {name: 'Saudi Arabia', code: 'SA'},
            {name: 'Senegal', code: 'SN'},
            {name: 'Serbia and Montenegro', code: 'CS'},
            {name: 'Seychelles', code: 'SC'},
            {name: 'Sierra Leone', code: 'SL'},
            {name: 'Singapore', code: 'SG'},
            {name: 'Slovakia', code: 'SK'},
            {name: 'Slovenia', code: 'SI'},
            {name: 'Solomon Islands', code: 'SB'},
            {name: 'Somalia', code: 'SO'},
            {name: 'South Africa', code: 'ZA'},
            {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
            {name: 'Spain', code: 'ES'},
            {name: 'Sri Lanka', code: 'LK'},
            {name: 'Sudan', code: 'SD'},
            {name: 'Suriname', code: 'SR'},
            {name: 'Svalbard and Jan Mayen', code: 'SJ'},
            {name: 'Swaziland', code: 'SZ'},
            {name: 'Sweden', code: 'SE'},
            {name: 'Switzerland', code: 'CH'},
            {name: 'Syrian Arab Republic', code: 'SY'},
            {name: 'Taiwan, Province of China', code: 'TW'},
            {name: 'Tajikistan', code: 'TJ'},
            {name: 'Tanzania, United Republic of', code: 'TZ'},
            {name: 'Thailand', code: 'TH'},
            {name: 'Timor-Leste', code: 'TL'},
            {name: 'Togo', code: 'TG'},
            {name: 'Tokelau', code: 'TK'},
            {name: 'Tonga', code: 'TO'},
            {name: 'Trinidad and Tobago', code: 'TT'},
            {name: 'Tunisia', code: 'TN'},
            {name: 'Turkey', code: 'TR'},
            {name: 'Turkmenistan', code: 'TM'},
            {name: 'Turks and Caicos Islands', code: 'TC'},
            {name: 'Tuvalu', code: 'TV'},
            {name: 'Uganda', code: 'UG'},
            {name: 'Ukraine', code: 'UA'},
            {name: 'United Arab Emirates', code: 'AE'},
            {name: 'United Kingdom', code: 'GB'},
            {name: 'United States', code: 'US'},
            {name: 'United States Minor Outlying Islands', code: 'UM'},
            {name: 'Uruguay', code: 'UY'},
            {name: 'Uzbekistan', code: 'UZ'},
            {name: 'Vanuatu', code: 'VU'},
            {name: 'Venezuela', code: 'VE'},
            {name: 'Viet Nam', code: 'VN'},
            {name: 'Virgin Islands, British', code: 'VG'},
            {name: 'Virgin Islands, U.S.', code: 'VI'},
            {name: 'Wallis and Futuna', code: 'WF'},
            {name: 'Western Sahara', code: 'EH'},
            {name: 'Yemen', code: 'YE'},
            {name: 'Zambia', code: 'ZM'},
            {name: 'Zimbabwe', code: 'ZW'}
        ];
    }

    public getMonths() {
        return [
            {value: '01', name: 'January'},
            {value: '02', name: 'February'},
            {value: '03', name: 'March'},
            {value: '04', name: 'April'},
            {value: '05', name: 'May'},
            {value: '06', name: 'June'},
            {value: '07', name: 'July'},
            {value: '08', name: 'August'},
            {value: '09', name: 'September'},
            {value: '10', name: 'October'},
            {value: '11', name: 'November'},
            {value: '12', name: 'December'}
        ];
    }

    public getStates() {
        return [{code: 'AN', name: 'Andaman and Nicobar Islands'},
            {code: 'AP', name: 'Andhra Pradesh'},
            {code: 'AR', name: 'Arunachal Pradesh'},
            {code: 'AS', name: 'Assam'},
            {code: 'BR', name: 'Bihar'},
            {code: 'CG', name: 'Chandigarh'},
            {code: 'CH', name: 'Chhattisgarh'},
            {code: 'DH', name: 'Dadra and Nagar Haveli'},
            {code: 'DD', name: 'Daman and Diu'},
            {code: 'DL', name: 'Delhi'},
            {code: 'GA', name: 'Goa'},
            {code: 'GJ', name: 'Gujarat'},
            {code: 'HR', name: 'Haryana'},
            {code: 'HP', name: 'Himachal Pradesh'},
            {code: 'JK', name: 'Jammu and Kashmir'},
            {code: 'JH', name: 'Jharkhand'},
            {code: 'KA', name: 'Karnataka'},
            {code: 'KL', name: 'Kerala'},
            {code: 'LD', name: 'Lakshadweep'},
            {code: 'MP', name: 'Madhya Pradesh'},
            {code: 'MH', name: 'Maharashtra'},
            {code: 'MN', name: 'Manipur'},
            {code: 'ML', name: 'Meghalaya'},
            {code: 'MZ', name: 'Mizoram'},
            {code: 'NL', name: 'Nagaland'},
            {code: 'OR', name: 'Odisha'},
            {code: 'PY', name: 'Puducherry'},
            {code: 'PB', name: 'Punjab'},
            {code: 'RJ', name: 'Rajasthan'},
            {code: 'SK', name: 'Sikkim'},
            {code: 'TN', name: 'Tamil Nadu'},
            {code: 'TS', name: 'Telangana'},
            {code: 'TR', name: 'Tripura'},
            {code: 'UK', name: 'Uttarakhand'},
            {code: 'UP', name: 'Uttar Pradesh'},
            {code: 'WB', name: 'West Bengal'}];
    }

    public getYears() {
        return ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
    }

    public getDeliveryMethods() {
        return [
            {value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days'},
            {value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days'},
            {value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days'}
        ];
    }

    public jsonToQueryString(json) {
        return '?' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    public encryptdata(request, customers_id) {
        // const url = 'http://localhost:3000/api/orders/encryptFormData';
        const url = this.backendUrl + 'encryptFormData';
        const data = {
            request,
            customers_id
        };
        return this.http.get<any>(url, {params: data});
        // return this.http.get<string>(this.backendUrl + 'encryptFormData?request=' + request);
    }
    public encryptdataCashfree(request, customers_id) {
        // const url = 'http://localhost:3000/api/orders/encryptFormData';
        const url = this.backendUrl + 'encryptFormDataCashfree';
        const data = {
            request,
            customers_id
        };
        return this.http.get<any>(url, {params: data});
       // return this.http.get<string>(this.backendUrl + 'encryptFormData?request=' + request);
    }
    public encryptPlandata(request, plan_id) {
        // const url = 'http://localhost:3000/api/orders/encryptFormData';
        const url = this.backendUrl + 'encryptPlanData';
        const data = {
            request,
            plan_id
        };
        return this.http.get<any>(url, {params: data});
        // return this.http.get<string>(this.backendUrl + 'encryptFormData?request=' + request);
    }

    public getSizes() {
        return [{id: 'xs', name: 'Extra Small'},
            {id: 's', name: 'Small'},
            {id: 'm', name: 'Medium'},
            {id: 'l', name: 'Large'},
            {id: 'xl', name: 'Extra Large'},
            {id: 'vect', name: 'Vector'},
            {id: 'xxl', name: 'Extra Larger'},
            {id: 'hd 720', name: 'HD 720'},
            {id: 'hd (1080)', name: 'HD 1080'},
            {id: '4k', name: '4k'},
            {id: 'web', name: 'Web'},
            {id: 'web2', name: 'Web 2'},
            {id: 'sd', name: 'SD'},
        ];
    }
}
