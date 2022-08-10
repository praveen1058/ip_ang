// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  environmentName: 'local',
  apiUrl: 'http://localhost:8000/api/indiapicture/',
  // apiUrl: 'https://indiapicture.in/api/api/indiapicture/',

  searchApiUrl : 'http://localhost/indiapicture_api/search-indiapicture-new.php',
  contributorUrl : 'http://localhost/indiapicture_api/contributor-profile',
  searchEdiApiUrl : 'http://localhost/indiapicture_api/apiibudgetphoto/ip_api/search-indiapicture-new.php',
  ccAvenueResponseUrl: 'http://localhost:8000/api/indiapicture/',
  ccavenueUrl: 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
  cashfreeResponseUrl: 'http://127.0.0.1:8000/api/indiapicture/',
  cashfreeUrl: 'http://127.0.0.1:8000/api/indiapicture/auth/cashfree-checkout/',
  merchant: '8229',
  accessCode: 'AVQZ83GB42AW72ZQWA',
  displayCollectionName: 0
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
