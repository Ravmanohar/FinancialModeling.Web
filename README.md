# FinancialModeling

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



##Code Scafolding 
ng g s ./services/authentication
ng g s ./services/guard
ng g s ./services/config
ng g s ./services/sharedmodel
ng g s ./services/setup-client
ng g s ./services/projection
ng g s ./services/utc-date
ng g s ./services/dashboard


ng g c ./components/shared/sidepanel

ng g c ./components/login
ng g c ./components/home

ng g c ./components/users

ng g c ./components/common/card-loader -m=./modules/shared.module

ng g c ./components/common/spinner -m=./modules/shared.module

ng g c ./components/manage-clients

ng g c ./components/view-clients
ng g c ./components/manage-client
ng g c ./components/setup-model

ng g c ./components/add-client
ng g c ./components/add-client-modal

ng g c ./components/modal-dashboard
ng g c ./components/client-models/projections
ng g c ./components/client-models/model-list
ng g c ./components/client-models/hourly-model
ng g c ./components/client-models/timeofday-model
ng g c ./components/client-models/escalating-model

ng g c ./components/financial-dashboard
ng g c ./components/financial-dashboard/instructions
ng g c ./components/financial-dashboard/main-dashboard
ng g c ./components/financial-dashboard/hourly-revenue


ng g c ./components/financial-dashboard/equipment-cost
ng g c ./components/financial-dashboard/equipment-cost/model-equipment-cost

ng g c ./components/financial-dashboard/equipment-cost/onstreet-equipment-cost
ng g c ./components/financial-dashboard/equipment-cost/offstreet-equipment-cost
ng g c ./components/financial-dashboard/equipment-cost/garages-equipment-cost

ng g c ./components/edit-client-modal

ng g p ./pipes/dixon-currency

<!-- ng g c ./components/register-user -->

file:///F:/Client%20Project/dixon/Html/HTML5_Full_Version/md-skin.html

TODO :
manage-clients - should be removed

ng build --prod --aot -- Worked
 -- Worked Best
ng build --prod --aot --buildOptimizer

 "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": true,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": true,
              "commonChunk": true,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }


https://www.toptal.com/designers/htmlarrows/arrows/






SQL Queries :
USE FinancialModelingDB_New

SELECT * FROM sys.tables

SELECT * FROM ClientModels

SELECT * FROM ApiErrors
SELECT * FROM ParkingClients
SELECT * FROM ClientModels
SELECT * FROM ParkingZones
SELECT * FROM Holidays
SELECT * FROM OperatingDays
SELECT * FROM OperatingHours
SELECT * FROM PermitTypes

EntityFramework Commands :

Enable-Migrations
Add-Migration MigrationName –IgnoreChanges
Update-Database

TRUNCATE TABLE ClientModels
TRUNCATE TABLE ParkingZones
TRUNCATE TABLE Holidays
TRUNCATE TABLE OperatingDays
TRUNCATE TABLE OperatingHours
TRUNCATE TABLE PermitTypes


HelpURL:
https://weblog.west-wind.com/posts/2016/jan/13/resetting-entity-framework-migrations-to-a-clean-slate



file:///E:/Projects/Clients/Xan/Helper%20Projects/HTML5_Full_Version/c3.html

file:///E:/Projects/Clients/Xan/Helper%20Projects/HTML5_Full_Version/form_advanced.html



07-13-2019:
Enable-Migrations
Add-Migration InitialMigration
Update-Database

The Designer Code for this migration file includes a snapshot of your current Code First model. This snapshot is used to calculate the changes to your model when you scaffold the next migration. If you make additional changes to your model that you want to include in this migration, then you can re-scaffold it by running 'Add-Migration InitialMigration' again.


The Designer Code for this migration file includes a snapshot of your current Code First model. This snapshot is used to calculate the changes to your model when you scaffold the next migration. If you make additional changes to your model that you want to include in this migration, then you can re-scaffold it by running 'Add-Migration InitialMigration' again.

A previous migration called 'InitialMigration' was already applied to the target database. If you meant to re-scaffold 'InitialMigration', revert it by running 'Update-Database -TargetMigration $InitialDatabase', then delete '201907131010429_InitialMigration1.cs' and run 'Add-Migration InitialMigration' again.


Update-Database -TargetMigration $InitialDatabase
Then delete '************_InitialMigration1.cs' 
Add-Migration InitialMigration
Update-Database

http://excelformulabeautifier.com/
This is a JavaScript and html5 based excel formula beautifier. It can also convert excel formulas to JavaScript. It has been built using Excel Formula Utilities JS
